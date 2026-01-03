# Przechowywanie tokena JWT i problem z odswiezeniem

## token JWT najlepiej przechowywac w stanie globalnym (RAM aplikacji) w połaczeniu z refresh token w HTTP cookie

Unikamy trzymania tokena w localstorage - ataki XSS
Token z RAMU zniknie po odswiezeniu strony - problem. Tworzymy komponent `AuthInitializer` i oplatamy nim cała aplikacje.

### Jak zagwarantować żeby AuthInitilizer wywołał się po każdym odswiezeniu?

Po odswiezeniu queryKey jest zawsze pusty (czysci sie RAM react query) wiec queryFn sie zawsze odpali i uwierzytelni uzytkownika po odswizeniu strony

```ts
<AuthInitializer>
  <RouterProvider router={router} />
</AuthInitializer>;

function AuthInitializer() {
  //...
  const { data, isLoading, isSuccess } = useQuery<User>({
    queryKey: ["user"],
    queryFn: checkUser, // wysyla na backend zapytanie z refreshtokenem w cookie i pyta sie czy jest on valid
    retry: false,
    refetchOnWindowFocus: false,
  });
}
```

## Wazny mechanizm przekazywania bledow!!!

### Na froncie pamietac zeby rzucac bledy z wczescniej przygotowanym komunikatem z backendu

```ts
//backend
if (!isValid) {
  return res.status(401).json({ message: "Wrong password" });
}

//frontend /services
throw new Error(error.response?.data.message);

//frontend /pages
const mutation = useMutation({
    ...
  });

{mutation.isError && (
  <div>{(mutation.error as Error).message}</div>
)}
```

# Komponenty z Wielkiej litery!

## React router - obsluguje co ma sie wyswietlac w zaleznosci od URL bez przeladowania strony

### W main.tsx tworzy sie provider ktory nie ma zadnych dzieci - jest najnizej w hierarchii

```ts
<StrictMode>
  <AuthInitializer>
    <RouterProvider router={router} /> // !!!
  </AuthInitializer>
</StrictMode>
```

## Tworzenie formsow

```
<form onSubmit={handleSubmit}>
```

#### handlesubmit to posrednik ktory pomoze obsluzyc nasze żądanie do serwera

## label w formsie - 2 podejscia

#### label oplatajacy input

**Najczesciej stosowane**. Klikniecie tekstu lapie focus na polu do wpisywania

```
<label>
  Email
  <input type="text" onChange={...} />
</label>

```

#### label i input osobno

Klikniecie tekstu 'email' nic nie robi. Przydaje się, gdy label i input powinny byc niezalezne

```
<label>Email</label>
<input id="email" type="text" onChange={...} />
```

# Obsluga zadan do backendu

## 1. axios

```ts
export async function login({ email, password }: loginRequestType) {
  try {
    const result = await api.post<loginBodyType>("api/auth/login", {
      body_requesta,
    });
    return result.data;
  } catch (error) {
    // Obsluga bledow
  }
}
```

### Wazne:

1. typowanie wysylanego body
2. typowanie co zwroci funkca
3. async/await + try/catch
4. obsluga bledow

## 2. React-query

Zalety:

- cachowanie
- gotowe funkcjonalosci np. mutation.isPending, mutation.isError

```ts
const mutation = useMutation({
  mutationFn: login,
  onSuccess: (data) => {
    console.log(data);
  },
});

const onSubmit = (data: formFields) => {
  mutation.mutate(data); // wywoluje login
};
```

# Schemat tworzenia formularzy

1. html
2. schemat pól i typu pól
3. utworzenie formsa (useForm)
4. podpiecie formsa (handleSubmit) i pól (register) do Zoda i RHF
5. UX: Obsluga mutation.error i mutaion.isPending

# Ustawianie stalych elementow na stronie np. navbar

```ts
// main.tsx
const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/login", element: <LoginPage /> },
    ],
  },
]);

// Layout.tsx
function Layout() {
  return (
    <div>
      <Navbar />
      <Outlet /> {/* Tutaj wstawi się HomePage lub LoginPage */}
    </div>
  );
}
```

## RHF Component

```tsx
const ReportFaultPage = () => {
  const { control, handleSubmit, setValue } = useForm<formFields>({
    resolver: zodResolver(formSchema),
  });
  return (
    <Box
      component="form"
      encType="multipart/form-data"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Controller
        name="image" // nazwa pliku ze schematu zoda
        control={control} // polaczenie Controllera z konkretnym formularzem
        render={({ field: { onChange, value, ...field } }) => {
          // render tlumaczy RHF jak podlaczyc sie i pobierac wartosci z niestandardowych komponentow
          // field to zestaw narzedzi ktory dostajemy od RHF do pracy z Controller
          // destrukuturyzujac ten obiekt wybieramy narzedzia, ktore chcemy dostosowac pod siebie (onChange, value) a reszte zostawiamy defaultowo (...field)
          // value - to co aktulanie jest w polu
          return (
            <Box>
              <Input
                type="file"
                sx={{ display: "none" }} // Ukrywamy domyślny input bo jest brzydki
                id="file-upload-button" // nadanie unikalnego ID, konieczne do polaczeneie z innym elementem
                {...field}
                onChange={(e) => {
                  const file = (e.target as HTMLInputElement).files?.[0];
                  if (file) {
                    setValue("image", file); // Mówimy RHF: "do pola 'image' wstaw ten plik!"
                  }
                }}
              ></Input>
              {/* Kliknięcie na <label> symuluje kliknięcie na <input>
                Dzięki temu, chodź input jest niewidoczny, jego funkcjonalność nadal działa */}
              <label
                htmlFor="file-upload-button" /* powiazanie z innym elementem o danym ID */
              >
                <Button variant="contained" component="span">
                  {value ? "Zmień plik" : "Wybierz plik"}
                </Button>
              </label>

              {value && <p>Wybrany plik: {value.name}</p>}
            </Box>
          );
        }}
      ></Controller>
    </Box>
  );
};
```

# Zwracaj tylko to, co klient faktycznie potrzebuje. Reszta zostaje na backendzie.

### To jest blad nie zwracamy calego obiektu bo zaweria on poufne info jak ID i hasło

```ts
const createdUser = await User.create({
  email: newUser.email,
  passwordHash: hashedPassword,
});

return res
  .status(201)
  .json({ createdUser, message: "User created successfuly" }); // !!! BŁĄD
```
