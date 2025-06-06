#!/bin/sh
set -e

LOG_FILE="/tmp/cloudflared.log"

# Start cloudflared in background and write output to a file
cloudflared tunnel --url http://localhost > "$LOG_FILE" 2>&1 &

echo "Waiting for cloudflared to initialize..."

# Wait until log file is created
WAIT_LOG_TIMEOUT=10
WAITED=0
while [ ! -f "$LOG_FILE" ]; do
    sleep 1
    WAITED=$((WAITED + 1))
    if [ "$WAITED" -ge "$WAIT_LOG_TIMEOUT" ]; then
        echo "Timed out waiting for cloudflared log file."
        exit 1
    fi
done

# Now wait until enough URLs appear
MAX_WAIT=30
WAITED=0
REQUIRED_URL_COUNT=4

while :; do
    URL_COUNT=$(grep -c 'https://' "$LOG_FILE" || echo 0)

    if [ "$URL_COUNT" -ge "$REQUIRED_URL_COUNT" ]; then
        break
    fi

    sleep 1
    WAITED=$((WAITED + 1))
    if [ "$WAITED" -ge "$MAX_WAIT" ]; then
        echo "⚠️ Timed out waiting for tunnel URLs."
        break
    fi
done

# Show all URLs found
ALL_URLS=$(grep -o 'https://[^ ]*' "$LOG_FILE" || true)
if [ -n "$ALL_URLS" ]; then
    echo "All URLs in: $ALL_URLS"

    # Show the 3rd URL (or change sed to match your case)
    TUNNEL_URL=$(echo "$ALL_URLS" | sed -n '3p')
    echo "Tunnel URL at: $TUNNEL_URL"

else
    echo "No URL found, proceeding without tunnel. Server will be accessible on localhost"
fi

# //Pick 3rd URL (or change sed to match your case)
# TUNNEL_URL=$(echo "$ALL_URLS" | sed -n '3p')
# if [ -n "$TUNNEL_URL" ]; then
#     echo "Tunnel is up at: $TUNNEL_URL"
# else
#     echo "Tunnel URL not found."
# fi


# //old style
# #!/bin/sh
# set -e
# LOG_FILE="/tmp/cloudflared.log"

# # Start cloudflared in the background and log output
# cloudflared tunnel --url http://localhost > "$LOG_FILE" 2>&1 &

# # Wait for tunnel URL to appear in log
# echo "Waiting for cloudflared to provide public URL..."
# until grep -q 'https://' "$LOG_FILE"; do
#   sleep 1
# done
# TUNNEL_URL=$(grep -o 'https://[^ ]*' "$LOG_FILE" | head -n 1)
# echo "Cloudflare tunnel is up: $TUNNEL_URL"

# //Only look for .trycloudflare.com
# #!/bin/sh
# set -e

# LOG_FILE="/tmp/cloudflared.log"

# # Start cloudflared in background and write output to a file
# cloudflared tunnel --url http://localhost > "$LOG_FILE" 2>&1 &

# echo "Waiting for cloudflared to initialize..."

# # Wait until log file is created
# WAIT_LOG_TIMEOUT=10
# WAITED=0
# while [ ! -f "$LOG_FILE" ]; do
#     sleep 1
#     WAITED=$((WAITED + 1))
#     if [ "$WAITED" -ge "$WAIT_LOG_TIMEOUT" ]; then
#         echo "Timed out waiting for cloudflared log file."
#         exit 1
#     fi
# done

# # Now wait until a .trycloudflare.com URL appears
# MAX_WAIT=30
# WAITED=0
# REQUIRED_URL_COUNT=1

# while :; do
#     # MODIFIED: Count only lines containing a .trycloudflare.com URL
#     URL_COUNT=$(grep -c 'https://.*\.trycloudflare\.com' "$LOG_FILE" || echo 0)

#     if [ "$URL_COUNT" -ge "$REQUIRED_URL_COUNT" ]; then
#         break
#     fi

#     sleep 1
#     WAITED=$((WAITED + 1))
#     if [ "$WAITED" -ge "$MAX_WAIT" ]; then
#         echo "⚠️ Timed out waiting for tunnel URLs."
#         break
#     fi
# done

# # MODIFIED: Extract only URLs ending with .trycloudflare.com
# ALL_URLS=$(grep -o 'https://[^ ]*\.trycloudflare\.com' "$LOG_FILE" || true)

# if [ -n "$ALL_URLS" ]; then
#     echo "All .trycloudflare.com URLs in: $ALL_URLS"

#     # Show the 1st .trycloudflare.com URL found
#     TUNNEL_URL=$(echo "$ALL_URLS" | sed -n '1p')
#     echo "Tunnel URL at: $TUNNEL_URL"

# else
#     echo "No .trycloudflare.com URL found, proceeding without tunnel. Server will be accessible on localhost"
# fi