import { Elysia } from 'elysia';
import { UniqueEntityID } from '@university/shared-kernel';

const app = new Elysia()
  .get('/', () => {
    const id = new UniqueEntityID();
    return {
      message: 'Hello from University API 🦊',
      generatedId: id.toString(),
      timestamp: new Date(),
    };
  })
  .listen(3000);

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
