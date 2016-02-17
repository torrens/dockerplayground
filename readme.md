Docker Playground
=================

Web Container
-------------

**Build Web Image**

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

Data Container
--------------
    
**Build Data Only Image**

Build the docker image using the Dockerfile in the dataOnly directory.

    docker build -t mtorrens/data-only dataOnly/    

-t Name and optionally a tag in the 'name:tag' format
    
**Run Data Container**

Run a command in the new container. 

    docker run --name data mtorrens/data-only
        
--name Assign a name to the container
    
    
MySql Container
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
    CREATE TABLE COUNTER(id MEDIUMINT NOT NULL AUTO_INCREMENT, count MEDIUMINT NOT NULL, PRIMARY KEY (id));
    insert COUNTER (count) values(1); 
    
Web Container
--------------

**Run Web Container** 

    docker run --name web -p 49160:8080 --link mysql:mysql -d mtorrens/web 
    
--link This means that in our container, the hostname mysql will be linked to the container named mysql. So in our database settings, we can specify mysql as the host.
    
    
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
