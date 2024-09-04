FROM oven-sh/bun

WORKDIR /src/

COPY package.json /src/
RUN npm install

COPY . /src/

EXPOSE 8080

CMD ["bun", "index.ts"]