//Define the helper function at the top level
def getVersion = { path ->
    def result = sh(script: "grep '^LABEL version' ${path} | cut -d'\"' -f2 || true", returnStdout: true).trim()
    // return (result != "") ? result : null //explicitly checks for an empty string
    return result ?: null // Groovy shothand for return (result != "") ? result : null

}

pipeline {
    agent any

    environment {
        REGISTRY = "ghcr.io/conicuznhm"
        IMAGE_API = "form-api"
        IMAGE_VITE = "form-vite"
        CONTAINER_CREDENTIALS_ID = "ghcr" // for pushing to GHCR
        GITHUB_CREDENTIALS_ID = "github-pat" // GitHub Personal Access Token:PAT stored in Jenkins, optional, for clone access
    }

    triggers {
        githubPush()
    }

    stages {
        stage('Checkout') {
            steps {
                git url: 'https://github.com/conicuznhm/form-app.git',
                    branch: 'main',
                    credentialsId: "${GITHUB_CREDENTIALS_ID}" // use GitHub PAT stored in Jenkins
            }
        }

        stage('Check Version Changes') {
            steps {
                script {
                    def versionChanged = { path ->
                        def current = getVersion(path)
                        def previous = sh(
                            script: "git show HEAD~1:${path} | grep '^LABEL version' | cut -d'\"' -f2 || true",
                            returnStdout: true
                        ).trim()
                        
                        // For debug version comparison
                        echo "Comparing version in: ${path}"
                        echo "Current version: ${current}"
                        echo "Previous version: ${previous}"

                        if (!current || !previous) {
                            echo "Skipping build for ${path} - missing or invalid version"
                            return false
                        }

                        def changed = current != previous
                        echo "Version changed: ${changed}"
                        return changed
                    }

                    env.BUILD_API = versionChanged('fill-api/Dockerfile')? "true" : "false"
                    env.BUILD_VITE = versionChanged('fill-vite/Dockerfile')? "true" : "false"
                }
            }
        }

        stage('Build Images') {
            steps {
                script {
                    if (env.BUILD_API?.toBoolean()) {
                        // def version = sh(script: "grep version fill-api/Dockerfile | cut -d'\"' -f2", returnStdout: true).trim()
                        def version = getVersion('fill-api/Dockerfile')
                        env.API_TAG = version
                        echo "Building form-api:${version} image..."
                        sh "docker build -t $REGISTRY/$IMAGE_API:${version} ./fill-api"
                    }

                    if (env.BUILD_VITE?.toBoolean()) {
                        // def version = sh(script: "grep version fill-vite/Dockerfile | cut -d'\"' -f2", returnStdout: true).trim()
                        def version = getVersion('fill-vite/Dockerfile')
                        env.VITE_TAG = version
                        echo "Building form-vite:${version} image..."
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
                    if (env.BUILD_API?.toBoolean()) {
                        echo "Pushing $REGISTRY/$IMAGE_API:${env.API_TAG} image..."
                        sh "docker push $REGISTRY/$IMAGE_API:${env.API_TAG}"
                    }
                    if (env.BUILD_VITE?.toBoolean()) {
                        echo "Pushing $REGISTRY/$IMAGE_VITE:${env.VITE_TAG} image..."
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