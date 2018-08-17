FROM alexsuch/angular-cli:latest

RUN mkdir -p /pg-front

WORKDIR /pg-front

ADD ./ ./

RUN npm install

EXPOSE 4200

ENTRYPOINT ng serve --host 0.0.0.0 --prod
