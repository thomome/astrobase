FROM node:lts as builder

ARG API_ENDPOINT
ENV API_ENDPOINT=$API_ENDPOINT

WORKDIR /app

COPY . .

RUN yarn install \
  --prefer-offline \
  --frozen-lockfile \
  --non-interactive \
  --production=false

RUN yarn build

RUN rm -rf node_modules && \
  NODE_ENV=production yarn install \
  --prefer-offline \
  --pure-lockfile \
  --non-interactive \
  --production=true

FROM node:lts

ARG API_ENDPOINT

WORKDIR /app

COPY --from=builder /app  .

ENV NODE_ENV production
ENV HOST 0.0.0.0
ENV API_ENDPOINT=$API_ENDPOINT
EXPOSE 8080

CMD [ "yarn", "start" ]