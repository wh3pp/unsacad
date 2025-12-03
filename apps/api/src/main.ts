import { Elysia } from 'elysia';
import { UniqueEntityID } from '@university/shared-kernel';

new Elysia()
  .get('/', () => {
    const id = new UniqueEntityID();
    return {
      message: 'Hello from University API 🦊',
      generatedId: id.toString(),
      timestamp: new Date(),
    };
  })
  .listen(3000);
