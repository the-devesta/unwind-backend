FROM public.ecr.aws/lambda/nodejs:20

WORKDIR ${LAMBDA_TASK_ROOT}

COPY package.json package-lock.json* tsconfig.json ./
COPY packages/ ./packages/
COPY src/ ./src/

RUN npm install
RUN npm run build

CMD [ "dist/app.handler" ]
