# Install wget
yum install wget -y

# Installl docker
yum install -y yum-utils device-mapper-persistent-data lvm2
yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
yum install docker-ce -y
usermod -aG docker $(whoami)
systemctl enable docker.service
systemctl start docker.service
systemctl status docker.service

# Install docker compose
curl -L "https://github.com/docker/compose/releases/download/1.24.1/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose
docker-compose version

# Install nginx
yum install nginx -y

# Allow nginx upstream
yum install policycoreutils-python -y
setsebool httpd_can_network_connect on -P
getsebool -a | grep httpd

