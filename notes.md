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

### 3. Docker na windowsie

Przy uruchamianiu kontenera Docker Desktop musi być uruchomiony, ponieważ na Windowsie nie ma natywnego silnika Dockera, tak jak na Linuxie

### 4. Typowanie modelu

```ts
// types.ts
export interface IUser extends Document {
  // jakies pola
}

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);
```

Bardzo fajna sprawa

Dzieki temu metody wywołane na User zwrócą obiekt User, zapewni to autouzupełnianie w IDE.

User.Create() - bedzie wymagać pól zgodnych z IUser

### Walidacja backend joi - .when()

Pozwala na walidacje warunkowa. Na przyklad jak jakies pola ma daną wartość to inne pole musi mieć jakąś tam

```ts
export const userRegisterValidationSchema = {
  body: Joi.object({
    location: Joi.object({
      dorm: Joi.string(),
      room: Joi.string()
    }).when("role", {
      is: //
      then: //
      otherwise: //
    }),
  })
}
```

### Pola ktore zostana wypelnione w przyszlosci

```
// schema
review: {
  type: String,
  default: ''
}

// joi schema
review: Joi.string().allow('').optional()
```

### Korealcja miedzy modelami mongoose - .populate()

Jeśli w schemacie zdefiniuje pole ktore jest referencją do innego modlelu `reportedBy: { type: Schema.Types.ObjectId, ref: "User"},`, możesz użyć .populate(''), a Mongoose automatycznie "podmieni" ID Usera na cały dokument tego obiektu.

### Przepływ danych przez middleware

```ts
userRouter.post(
  "/:userID/addFault",
  verifyJWT,
  verifyRole("student"),
  validate(newFaultSchema),
  addFault
);
```

1. Zanim żądanie HTTP przejdzie do kontrolera `addFault` to przechodzi przez pośredników ktorzy mogą je odrzucić lub zmodyfikować nagłówki i ciało `req`.
2. Middleware dzialaja sekwencyjnie jeden pod drugim. Jest to wazne bo `verifyRole` skorzysta z pola, które zostanie dodane do nagłówka przez `verifyJWT`
3. `next()` - trzeba pamietac o tym, pozwala przejsc do nastepnego kontrolera
4. Middleware przygotowuje żądanie

```ts
const addFault = async (req: Request, res: Response) => {
  // Jesli potok doszedl do tego miejsca to tutaj mamu juz pewnosc ze żądanie przeszlo walidacje i zawiera odpowiednie nagłówki.
};
```

5. Przykładowy przeplyw

- Uzytkownik sie loguje ( tworzony jest token z zakodowaną rolą logującego się usera)
- Uzytkownik wysyla request i weryfikowany jest token. Jesli weryfikacja przejdzie pomyslnie to payload tokena jest dekodowany i odkryta rola jest dodawana do naglowaka jako `req.user.role`
- Nastepny middleware skorzysta z tego naglowka aby zweryfikowac czy ta rola ma dostep do kontrolera
- Jesli token i rola sie zgadzaja to walidacje przechodzi `req.body`. Sprawdzane jest czy zawiera wymagane pola o odpowiedniej nazwie oraz czy sa one odpowiedniego typu itd...
- Jesli żaden middleware nie zwroci bledu to dochodzimy do funkcji kontrolera ktora ma pewnosc ze obsluzy poprawnie skonstruowane żądanie.
