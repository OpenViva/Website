FROM node:20-alpine AS builder
WORKDIR /build
RUN apk add --update --no-cache \
    # Gyp build dependencies
    python3 make g++ py-setuptools \
    # Canvas build dependencies
    pixman-dev cairo-dev jpeg-dev pango-dev giflib-dev pixman-dev pangomm-dev libjpeg-turbo-dev freetype-dev pkgconfig; \
    rm -rf /var/cache/apk/*
COPY . .
RUN npm install && \
    npm run build:prod && \
    npm prune --production && \
    mv dist /app && \
    mv node_modules /app/node_modules

FROM node:20-alpine AS runtime
WORKDIR /app
RUN apk add --update --no-cache \
    # Canvas runtime dependencies
    python3 cairo jpeg pango giflib pixman pangomm libjpeg-turbo freetype; \
    rm -rf /var/cache/apk/*
ENV PORT=80
EXPOSE 80
HEALTHCHECK --interval=10s --timeout=5s --retries=2 CMD wget --no-verbose --tries=1 --spider "http://127.0.0.1:$PORT/" || exit 1
COPY --from=builder /app .
CMD ["npm", "start"]
