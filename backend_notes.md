# Notatki czego nauczylem sie w praktyce

## 1. Rzucanie bledow ma sens tylko wtedy gdy kod w ktorym jest wywolana funckja rzucajaca blad ma blok trycatch

## 2. async/await vs then/catch

**Ten sam efekt** ale uzywa sie trycatch bo jest noweczesniejsze i bardziej czytelne

```js
try {
  await mongoose.connect();
} catch (error) {
  throw error;
}

mongoose.connect().then().catch();
```

## 3. Docker na windowsie

Przy uruchamianiu kontenera Docker Desktop musi być uruchomiony, ponieważ na Windowsie nie ma natywnego silnika Dockera, tak jak na Linuxie

## 4. Typowanie modelu

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

## Walidacja backend joi - .when()

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

## Pola ktore zostana wypelnione w przyszlosci

```
// schema
review: {
  type: String,
  default: ''
}

// joi schema
review: Joi.string().allow('').optional()
```

Jesli nie podamy wartosci to mongoose automatycznie utworzy pusty string - chodzi o to zeby uniknac nulla i undefined

## Korealcja miedzy modelami mongoose - .populate()

Jeśli w schemacie zdefiniuje pole ktore jest referencją do innego modlelu `reportedBy: { type: Schema.Types.ObjectId, ref: "User"},`, możesz użyć `.find.populate('User')`, a Mongoose automatycznie "podmieni" ID Usera na cały dokument tego obiektu.

```ts
await Fault.find().populate('reportedBy'):
```

```json
"reportedBy": {
     "location": {
         "dorm": "Olimp",
         "room": "711A"
     },
 }
```

---

```ts
await Fault.find();
```

```json
"reportedBy": "690faf089864e7a6a3d4c300"
```

## Przepływ danych przez middleware

```ts
userRouter.post(
  "/addFault",
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

## Skąd brać id?

Jesli operujemy tokenem JWT to o wiele lepiej wyciągać userID z niego, a nie z URL.
Jest to bezpieczniejsze i czystsze rozwiązanie.

```ts
// verifyJWT.js
req.user = decoded;

// kontroler
const userID = req.user?.userId;
```

Używanie userID w URL ma sens tylko wtedy, gdy administrator wykonuje operacje na cudzych kontach

```ts
userRouter.post("/:userID/addFault");
const { userID } = req.params;
```

## Typowanie stałe i jednorazowe

### Stałe

```ts
declare global {
  namespace Express {
    interface Request {
      user?: MyJwtPayload; // dzieki '?' dziala rowniez w trasach ktore nie korzystaja z JWT
    }
  }
}
```

Dzięki temu **każde** req w projekcie będzie miało pole user.
Przydatne gdy mamy walidator ktory dodaje zdekodowany payload tokena do naglowka.

### Pojedyncze

```ts
export interface newFaultBody {
  description: string;
  state?: string;
  review?: string;
}

const addFault = async (req: Request<{}, {}, newFaultBody>, res: Response) => {
  const faultData = req.body; // W pełni typowane
};
```

Lokalne typowanie, elastyczne rozwiazanie gdy kazdy kontroler przyjmuje inne body

## Specjalny middleware do obslugi bledow - 4 arguemnty!

Wywoła się **tylko** wtedy gdy poprzedni middleware wywoła `next(error)` lub wystąpił wyjątek w async funkcji. Express automatycznie przeskoczy do tego middleware'a (rozpozna go po dodatkowym argumencie 'err')

```ts
const multerErrorHandler = (err, req, res, next);
```

### Uwaga!!! - Multer przy bledzie automatycznie wyrzuci next(error)

## Promisy

Pare zasad:

1. Await rozpakowuje promise aby uzyskac wartosc
2. Aby promise nie zawisł musi mieć resolve() lub reject()
3. Każdy Promise może zostać rozwiązany (resolve) albo odrzucony (reject) tylko jeden raz
4. Nie zapewnia asynchronicznosci, jest tylko narzedziem które je obsługuje

```
new Promise((resolve, reject) => {
  resolve("OK");
  reject("Error");  // BŁĄD!!!
});
```

## Edytowanie

Ograniczenie pól które można edytowac - stworzenie walidatora JOI

```ts
export const editFaultSchema = {
  body: Joi.object({
    description: Joi.string(),
  }).unknown(false), // wszystkie pola o innej nazwie nie zostaną przepuszczane - wyrzuci blad
};
```

Składnia edycji:

```ts
const updatedFault = await Fault.findOneAndUpdate(
  { _id: faultID, reportedBy: req.user?.userId }, // zabezpieczenie ze tylko wlasciciel moze edytowac swoją usterke
  { $set: newData },
  { new: true }
);
```

## Usuwanie plikow cloudinary

Aby usunac plik potrzebujemy jego public_id. Dlatego wczesniej przy uploadowaniu obrazka musimy je przechwycic i zapisac w bazie.

```ts
if (deletedFault?.imageID) {
  await cloudinary.uploader.destroy(deletedFault.imageID);
}
```

## Wyrobic nawyk zwracania nowo-utworzonych i znalezionych danych dla frontendu

```ts
const user = await User.findOne({ email: loginData.email });

return res.status(200).json({
  user: { id: user._id, username: user.username, role: user.role },
  accessToken: accesToken,
  message: "Logged sucessfuly",
});
```

### UWAGA! - Przy zwracaniu usera nie zwracamy wrażliwych danych, tylko przefiltrowane bez haseł itd!!!

# operatory ts

```ts
const technicianId = req.user!.userId; // zapewniamy ts że to pole nie jest null
```

```ts
Request<Params, ResBody, ReqBody, Query>; // typowanie requesta na endpoincie
```

## w sql domyslne pole id to "id", a w mongo "\_id"
