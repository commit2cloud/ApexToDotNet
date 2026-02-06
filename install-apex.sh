#!/bin/bash
# Install Oracle APEX and ORDS in the running container

set -e

echo "=========================================="
echo "Installing Oracle APEX and ORDS"
echo "=========================================="

# Wait for container to be healthy
echo "Waiting for database container to be healthy..."
timeout=180
elapsed=0
while [ $elapsed -lt $timeout ]; do
    if docker inspect --format='{{.State.Health.Status}}' apex-db 2>/dev/null | grep -q "healthy"; then
        echo "Container is healthy!"
        break
    fi
    echo "Waiting... ($elapsed/$timeout seconds)"
    sleep 5
    elapsed=$((elapsed + 5))
done

if [ $elapsed -ge $timeout ]; then
    echo "ERROR: Container did not become healthy in time"
    exit 1
fi

echo ""
echo "Step 1: Installing APEX into the database..."
echo "This will take several minutes..."
echo ""

# Install APEX
docker exec -it apex-db bash -c 'cd /tmp && \
    echo "Downloading APEX 24.2..." && \
    curl -L -o apex.zip "https://download.oracle.com/otn_software/apex/apex_24.2.zip" 2>/dev/null && \
    echo "Extracting APEX..." && \
    unzip -q apex.zip && \
    cd apex && \
    echo "Installing APEX (this takes 5-10 minutes)..." && \
    echo exit | sqlplus sys/Oracle123!@//localhost:1521/XEPDB1 as sysdba @apexins.sql SYSAUX SYSAUX TEMP /i/ && \
    echo "Configuring APEX REST..." && \
    echo -e "Oracle123!\nOracle123!" | sqlplus sys/Oracle123!@//localhost:1521/XEPDB1 as sysdba @apex_rest_config.sql && \
    echo "Unlocking APEX users..." && \
    sqlplus sys/Oracle123!@//localhost:1521/XEPDB1 as sysdba <<EOF
ALTER USER APEX_PUBLIC_USER ACCOUNT UNLOCK;
ALTER USER APEX_PUBLIC_USER IDENTIFIED BY Oracle123!;
ALTER USER APEX_REST_PUBLIC_USER ACCOUNT UNLOCK;
ALTER USER APEX_REST_PUBLIC_USER IDENTIFIED BY Oracle123!;
EXIT;
EOF
' 

echo ""
echo "Step 2: Setting APEX INTERNAL workspace admin password..."
echo ""

docker exec -it apex-db bash -c 'sqlplus sys/Oracle123!@//localhost:1521/XEPDB1 as sysdba <<EOF
BEGIN
    APEX_UTIL.SET_SECURITY_GROUP_ID(10);
    APEX_UTIL.CREATE_USER(
        p_user_name       => '\''ADMIN'\'',
        p_email_address   => '\''admin@example.com'\'',
        p_web_password    => '\''Oracle123!'\'',
        p_developer_privs => '\''ADMIN'\'',
        p_change_password_on_first_use => '\''N'\''
    );
    APEX_UTIL.SET_SECURITY_GROUP_ID(null);
    COMMIT;
END;
/
EXIT;
EOF
'

echo ""
echo "Step 3: Installing ORDS..."
echo ""

docker exec -it apex-db bash -c 'cd /tmp && \
    echo "Downloading ORDS..." && \
    curl -L -o ords.zip "https://download.oracle.com/otn_software/java/ords/ords-24.3.0.286.1819.zip" 2>/dev/null && \
    echo "Extracting ORDS..." && \
    unzip -q ords.zip -d /opt/oracle/ords && \
    cd /opt/oracle/ords && \
    mkdir -p logs config && \
    echo "Configuring ORDS..." && \
    java -jar ords.war install --admin-user SYS --db-hostname localhost --db-port 1521 --db-servicename XEPDB1 --feature-db-api true --feature-rest-enabled-sql true --feature-sdw true --proxy-user --log-folder /opt/oracle/ords/logs --password-stdin <<EOFORDS
Oracle123!
Oracle123!
EOFORDS
'

echo ""
echo "Step 4: Starting ORDS server..."
echo ""

# Start ORDS in the background
docker exec -d apex-db bash -c 'cd /opt/oracle/ords && nohup java -jar ords.war serve > logs/ords.log 2>&1 &'

echo ""
echo "Waiting for ORDS to start (30 seconds)..."
sleep 30

echo ""
echo "=========================================="
echo "Installation Complete!"
echo "=========================================="
echo ""
echo "✅ Oracle APEX and ORDS are now installed!"
echo ""
echo "🌐 Access APEX at:"
echo "   http://localhost:8080/ords"
echo "   http://localhost:8080/ords/apex_admin"
echo ""
echo "🔐 Default Credentials:"
echo "   Workspace: INTERNAL"
echo "   Username:  ADMIN  "
echo "   Password:  Oracle123!"
echo ""
echo "⚠️  IMPORTANT: Change the default password immediately!"
echo ""
echo "📋 Check ORDS logs:"
echo "   docker exec apex-db tail -f /opt/oracle/ords/logs/ords.log"
echo ""
echo "=========================================="
