Docker Playground
=================

This repo includes a set of resources to help get started with Docker.  In order to use the assets in this repo and follow this readme, you should first intsall the [Docker Toolbox.](https://docs.docker.com/mac/step_one/)

The steps below will show you how to deploy a simple web application and MySQL database using Docker containers.  It will show you how to use Docker Compose and finally deploy the same containers on a cloud host. 

Web Image
-------------

The web image is made up of a simple NodeJs application that displays the time, increments a count in a database and gets the count from the database.  The endpoints of the web application are:

- /      - displays the Date
- /count - displays the current Count
- /inc   - increments the Count

**Build Web Image**

The first thing to do is build a Docker image using the [Dockerfile](../web/Dockerfile) stored in the web directory.  

    docker build -t mtorrens/web web/
    
Build the docker image using the Dockerfile in the web directory.
-t Name and optionally a tag in the 'name:tag' format
    
**Run Web Images**

Run a command in the new container.  

    docker run --name web -p 49160:8080 -d mtorrens/web 
  
--name Assign a name to the container
-p Publish a container's port(s) to the host
-d Run container in background and print container ID
    
**View Docker Machine IP**

    docker-machine ip
    
**Visit Node Application**

    http://<docker machine ip>:49160/

Data Image
--------------
    
**Build Data Only Image**

Build the docker image using the Dockerfile in the dataOnly directory.

    docker build -t mtorrens/data-only dataOnly/    

-t Name and optionally a tag in the 'name:tag' format
    
**Run Data Container**

Run a command in the new container. 

    docker run --name data mtorrens/data-only
        
--name Assign a name to the container
    
    
MySql Image
---------------
    
**Run MySQL Image**

    docker run --name mysql \
            --volumes-from data \
            -p 3606:3606 \
            -e MYSQL_ROOT_PASSWORD=secret-pwd \
            -e MYSQL_USER=mysql_username \
            -e MYSQL_PASSWORD=mysql_password \
            -e MYSQL_DATABASE=mysql_database_name \
            -v `pwd`/dataBase/conf.d:/etc/mysql/conf.d \
            -d mysql/mysql-server:latest
            
**Run Bash Script on SQL**

    docker exec -it mysql bash
    
**Run MySQL Client**

    mysql -uroot -psecret-pwd
    
    CREATE DATABASE test;
    USE test;
    CREATE TABLE COUNTER(id MEDIUMINT NOT NULL AUTO_INCREMENT, count MEDIUMINT NOT NULL, PRIMARY KEY (id));
    INSERT COUNTER (count) values(1); 
    
Web Container
--------------

**Run Web Container** 

    docker run --name web -p 49160:8080 --link mysql:mysql -d mtorrens/web 
    
--link This means that in our container, the hostname mysql will be linked to the container named mysql. So in our database settings, we can specify mysql as the host.
 
All Together Now
----------------

    docker-compose up -d
    
**Bring it down**

    docker-compose down
    
On the Cloud
------------

**Build a DigitalOcean Droplet**

    docker-machine create --driver digitalocean --digitalocean-access-token XXXX docker-sandbox
    
  
**List Docker Machines**

    docker-machine ls    

**SSH Droplet**

    docker-machine ssh docker-sandbox
    
**Make the Droplet the Active Docker Host**

    eval $(docker-machine env docker-sandbox)

**Run Docker Compose on Droplet**

    docker-compose up -d
    
Then visit url droplet ip:49160

**Stop Docker Host and Remove Droplet**

    docker-machine stop docker-sandbox
    docker-machine rm docker-sandbox
    
Miscellaneous Commands
----------------------    
    
SSH Docker Host
    
    docker-mashine ssh    
    
View Images

    docker images

Remove A Docker Image

    docker rmi <image>
    
View Running Containers

    docker ps
    
View Running and Stopped Containers

    docker ps -a
    
Stop Running Container

    docker stop <container id>   
