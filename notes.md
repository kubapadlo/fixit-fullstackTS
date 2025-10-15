# Notatki czego nauczylem sie w praktyce

### 1. Rzucanie bledow ma sens tylko wtedy gdy kod w ktorym jest wywolana funckja rzucajaca blad ma blok trycatch

### 2. async/await vs then/catch

**Ten sam efekt** ale uzywa sie trycatch bo jest noweczesniejsze i bardziej czytelne

```js
try {
  await mongoose.connect();
} catch (error) {
  throw error;
}

mongoose.connect().then().catch();
```
