FROM alexsuch/angular-cli:latest

RUN mkdir -p /pg-front

WORKDIR /pg-front

ADD ./ ./

ENTRYPOINT ng serve
