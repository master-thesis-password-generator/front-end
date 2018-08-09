FROM alexsuch/angular-cli:latest

RUN mkdir -p /pg-front

WORKDIR /pg-front

ENTRYPOINT ng serve
