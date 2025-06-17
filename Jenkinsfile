pipeline {
    agent any

    environment {
        REGISTRY = "ghcr.io/conicuznhm"
        IMAGE_API = "form-api"
        IMAGE_VITE = "form-vite"
        CONTAINER_CREDENTIALS_ID = "ghcr"
    }

    triggers {
        githubPush()
    }

    stages {
        stage('Checkout') {
            steps {
                git url: 'https://github.com/conicuznhm/form-app.git', branch: 'main'
            }
        }

        stage('Check Version Changes') {
            steps {
                def versionChanged = { path ->
                    def current = sh(script: "grep version ${path} | cut -d'\"' -f2", returnStdout: true).trim()
                    def remote = sh(script: "git fetch origin main && git show origin/main:${path} | grep version | cut -d'\"' -f2", returnStdout: true).trim()
                    return current != remote
                }

                env.BUILD_API = versionChanged('fill-api/Dockerfile')? "true" : "false"
                env.BUILD_VITE = versionChanged('fill-vite/Dockerfile')? "true" : "false"
            }
        }

        stage('Build Images') {
            steps {
                script {
                    if (env.BUILD_API.toBoolean()) {
                        def version = sh(script: "grep version fill-api/Dockerfile | cut -d'\"' -f2", returnStdout: true).trim()
                        env.API_TAG = version
                        sh "docker build -t $REGISTRY/$IMAGE_API:${version} ./fill-api"
                    }

                    if (env.BUILD_VITE.toBoolean()) {
                        def version = sh(script: "grep version fill-vite/Dockerfile | cut -d'\"' -f2", returnStdout: true).trim()
                        env.VITE_TAG = version
                        sh "docker build -t $REGISTRY/$IMAGE_VITE:${version} ./fill-vite"
                    }
                }
            }
        }

        stage('Login to GHCR') {
            steps {
                withCredentials([usernamePassword(credentialsId: "${CONTAINER_CREDENTIALS_ID}", usernameVariable: 'USERNAME', passwordVariable: 'TOKEN')]) {
                    sh "echo $TOKEN | docker login ghcr.io -u $USERNAME --password-stdin"
                }
            }
        }

        stage('Push Images') {
            steps {
                script {
                    if (env.BUILD_API.toBoolean()) {
                        sh "docker push $REGISTRY/$IMAGE_API:${env.API_TAG}"
                    }
                    if (env.BUILD_VITE.toBoolean()) {
                        sh "docker push $REGISTRY/$IMAGE_VITE:${env.VITE_TAG}"
                    }
                }
            }
        }
    }

    post {
        always {
            echo 'Cleaning up credentials...'
            sh 'docker logout ghcr.io'
        }
    }
}