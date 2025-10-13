FROM node:20

WORKDIR /usr/src/app

COPY . ./
RUN npm install

EXPOSE 3000

ENV HOST=0.0.0.0
ENV PORT=3000
ENV NODE_ENV=production

# Cloudflare Flexible SSL için gerekli
ENV NUXT_PUBLIC_SITE_URL=https://crm.valdori.com

RUN npm run build

CMD ["npm", "run", "start"]
