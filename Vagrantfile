# -*- mode: ruby -*-
# vi: set ft=ruby :

# All Vagrant configuration is done below. The "2" in Vagrant.configure
# configures the configuration version (we support older styles for
# backwards compatibility). Please don't change it unless you know what
# you're doing.
Vagrant.configure("2") do |config|

  config.vm.box = "ubuntu/zesty64"

  config.vm.network "private_network", ip: "192.168.17.71"

  config.vm.provider "virtualbox" do |vb|
    vb.memory = "1024"
  end

  config.vm.provision "shell", inline: <<-SHELL
    echo "#!/bin/sh" >> start.sh
    echo "cd /vagrant" >> start.sh
    echo "nohup npm start &" >> start.sh
    chmod +x start.sh
    echo "=== INSTALLING NODE/NPM ==="
    wget https://nodejs.org/dist/v8.2.1/node-v8.2.1-linux-x64.tar.xz -o wget.txt
    tar -xf node-v8.2.1-linux-x64.tar.xz
    mv node-v8.2.1-linux-x64 /usr/local/lib/node && cd $_
    chmod 777 bin/*
    ln -s /usr/local/lib/node/bin/* /usr/local/bin/
    echo "=== INSTALLING UPDATES ==="
    apt-get update
    apt-get install --assume-yes nginx curl
    echo "=== INSTALLING MYSQL ===="
    debconf-set-selections <<< 'mysql-server mysql-server/root_password password dsvcdevmysql'
    debconf-set-selections <<< 'mysql-server mysql-server/root_password_again password dsvcdevmysql'
    apt-get -y install mysql-server mysql-client
    echo "===== IMPORTING DATA ====="
    mysql -h localhost -u root -pdsvcdevmysql < /vagrant/src/sql/setup/createDb.sql
    cat /vagrant/src/sql/*.sql | mysql -h localhost -u root -pdsvcdevmysql dsvcdev
    cat /vagrant/src/sql/data/*.sql | mysql -h localhost -u root -pdsvcdevmysql dsvcdev
    echo "====== NGINX SET-UP ======"
    cp /vagrant/vagrant_nginx.conf /etc/nginx/sites-available/ds-svc-final
    ln -s /etc/nginx/sites-available/ds-svc-final /etc/nginx/sites-enabled/ds-svc-final
    rm /etc/nginx/sites-enabled/default
    service nginx restart
    echo "=== RESOLVING NPM DEPS ==="
    cd /vagrant
    npm install
    echo "==== STARTING SERVICE ===="
    echo "DS_DB_HOST=localhost" >> /etc/environment
    echo "DS_DB_USER=root" >> /etc/environment
    echo "DS_DB_PASS=dsvcdevmysql" >> /etc/environment
    echo "DS_DB_NAME=dsvcdev" >> /etc/environment
    echo "DS_SERVER_NAME=api.datastudio.localhost" >> /etc/environment
    echo "DS_SERVER_PROTOCOL=http" >> /etc/environment
    nohup npm start &
  SHELL
end
