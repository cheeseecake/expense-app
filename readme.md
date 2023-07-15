# Expense App

## Architecture

Traditional Structure:

Client <-> Communication Protocol <-> Server <-> Database

Heavy operations can be done server-side

Client: tRPC: https://trpc.io/

Server:https://trpc.io/docs/server/adapters/standalone

Database:

- Raw SQL connection/
- Use an Object Relational Mapper like https://www.prisma.io/