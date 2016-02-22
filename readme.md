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

The first thing to do is build a Docker image using the [Dockerfile](web/Dockerfile) stored in the web directory.  This Dockerfile creates a Docker image by installing node, npm, the sample web application and then executes an npm install.

    docker build -t mtorrens/web web/
    
-t Name and optionally a tag in the 'name:tag' format

You can verify the image has been built by running 

    docker images
    
    REPOSITORY          TAG                 IMAGE ID            CREATED             SIZE
    mtorrens/web        latest              2061367ed0c6        1 hour ago          475.7 MB
    centos              centos6             2e4f3f04a056        1 hour ago          228.9 MB
    
**Run Web Images**

Next create a container from this image on your Docker host.

    docker run --name web -p 49160:8080 -d mtorrens/web 
  
--name Assign a name to the container
-p Publish a container's port(s) to the host, map 8080 to 49160.
-d Run container in background and print container ID
    
**Visit Node Application**

First find out the IP address of default Docker host, by running the following command.

    docker-machine ip
    
Then visit our web application in your browser.  You should see the current Date displayed in the browser.

    http://<docker machine ip>:49160/

Data Image
--------------

To persist the data we will eventually modify in the database, we need a data only image.  We have a data only [Dockerfile](/dataOnly/Dockerfile) for this.
    
**Build Data Only Image**

Build the docker image using the Dockerfile in the dataOnly directory.

    docker build -t mtorrens/data-only dataOnly/    

-t Name and optionally a tag in the 'name:tag' format
    
**Run Data Container**

Now create the data only container.

    docker run --name data -d mtorrens/data-only
        
--name Assign a name to the container
-d Run container in background and print container ID
    
    
MySql Image
---------------

There is already an official Docker image for a MySQL database.  So we just need to run it to create our MySQL container.

    docker run --name mysql \
            --volumes-from data \
            -p 3606:3606 \
            -e MYSQL_ROOT_PASSWORD=secret-pwd \
            -v `pwd`/dataBase/conf.d:/etc/mysql/conf.d \
            -d mysql/mysql-server:latest
            
--name Assign a name to the container
--volumes-from Mount a container as data
-p Publish a container's port(s) to the host, map 3606 to 3606.
-e Set an environment variable
-v Mount local directory inside the container
-d Run container in background and print container ID
            
**Create a new database, table and data to allow the web application to operate**

First get a bash terminal to the MySQL container.

    docker exec -it mysql bash
    
Then start a MySQL terminal and create the assets.

    mysql -uroot -psecret-pwd
    
    CREATE DATABASE test;
    USE test;
    CREATE TABLE COUNTER(id MEDIUMINT NOT NULL AUTO_INCREMENT, count MEDIUMINT NOT NULL, PRIMARY KEY (id));
    INSERT COUNTER (count) values(1); 
    
Stop and start the mysql container to prove the data still exists.  It's the use of the data only container which means the data is persisted.

    docker stop mysql
    docker start mysql
    
Web Container
--------------

To allow the web container to access the mysql container, stop the web container, remove it and re-run it with the link commnad.  When the web container is re-run visiting the website count endpoint should now display the count from the database.

    docker stop web
    docker rm web
    docker run --name web -p 49160:8080 --link mysql:mysql -d mtorrens/web 
    http://<docker machine ip>:49160/count
    
--name Assign a name to the container
-p Publish a container's port(s) to the host, map 8080 to 49160.
--link This means that in our container, the hostname mysql will be linked to the container named mysql. So in our database settings, we can specify mysql as the host.
-d Run container in background and print container ID.

Tested docs to here.
 
All Together Now
----------------

Creating one container at a time is time consuming.  Docker Compose lets you create a number of containers at once.  Docker Compose uses yml files to define the containers to create.  The Docker Compose file can be found [here](docker-compose.yml). Existing containers will need stopped and removed before running Docker Compose.

    docker-compose up -d
    
Then visit our web application in your browser.  You should see the current Date displayed in the browser.

    http://<docker machine ip>:49160/
    
You can then bring all containers down.

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
