FROM perl:5.20

RUN cpan -i Email::Outlook::Message
RUN curl -sL https://deb.nodesource.com/setup_13.x | bash -
RUN apt-get install -y nodejs

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
CMD [ "node", "src/index.js" ]

EXPOSE 3000