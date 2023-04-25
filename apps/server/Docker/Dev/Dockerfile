FROM postgres

WORKDIR /app

ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=postgres
ENV POSTGRES_DB=postgres



COPY drizzle/*.sql /temp/drizzlemigrations/
RUN cat /temp/drizzlemigrations/0000_*.sql > /docker-entrypoint-initdb.d/init.sql


EXPOSE 5432
