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

## navigate() vs wpisanie URL z palca

Wpisanie URL z palca = pełne odświeżenie aplikacji

navigate() / Link = zmiana widoku bez resetu stanu

## asynchronicznosc

```ts
// BŁĘDNIE
const handleLogout = () => {
  logoutUser(); // funkcja async api usuwajaca ciasteczko z tokenem
  setUser(null, null); // stan globalny
};
```

## BŁĄD: setUser() wywola sie odrazu nie czekajac na zakonczenie async funkcji 'logoutUser()'. setUser() wyzeruje stan globalyn ale ciasteczko dalej bedzie wiec CheckAuth moze go przywrocic - BŁĄD!!!

```ts
// POPRAWNIE
const handleLogout = async () => {
  await logoutUser(); // funkcja async
  setUser(null, null);
};
```

## Istotne luki czasowe miedzy Isloading==false, a wywoalniem useEffect()

```ts
//main.tsx
<CheckAuth>     // oplata całą aplikacje
  <RouterProvider router={router} />
</CheckAuth>

{
  element: <RequireRole allowedRoles={["technician"]} />, // RequireRole sprawdza stan globalny
  children: [{ path: "/dashboard", element: <DashboardPage /> }],
},


// CheckAuth.tsx
export default function CheckAuth({ children }: { children: React.ReactNode }) {
  const { data, isLoading,isSuccess, } = useQuery({
    queryFn: refresh,
  });

  // Ustawiamy usera w stanie globalnym
  useEffect(() => {
    if (isSuccess && data) {
      setUser(data.user, data.accessToken);
    }
  }, [isSuccess, data, setUser]);

  // jesli dalej pobieranie z api
  if (isLoading) {
    return ( kolko_ladowania...)
  }

  // jesli skoczylo sie pobieranie z serwera
  return <>{children}</>;
}

```

Problem: Mimo ze dane zostaly juz pobrane z API (isLoading=false => render<>{children}</>(RequireRole) => RequireRole sprawdza stan globalny ktory jest dalej pusty)

useEffect w CheckAuth jeszcze nie zdążył zadziałać(**działa on po fazie renderowania komponentu**).
Oznacza to, że w momencie, gdy RequireRole jest renderowane, setUser JESZCZE NIE ZOSTAŁO WYWOŁANE. Stan globalny user jest nadal null.

Problem jest ten ulamek czasu miedzy zakonczeniem pobierania z serwera a wykonaniu sie useEffect

### Rozwiazanie

```tsx
export default function CheckAuth({ children }: { children: React.ReactNode }) {
  const { user, setUser, logout } = useLoggedUserState();

  const authCheckAttempted = useRef(false); // proba zmianu stanu globalnego

  const { data, isLoading, isError, isSuccess, error } = useQuery({
    queryFn: refresh,
  });

  useEffect(() => {
    if (isSuccess && data) {
      setUser(data.user, data.accessToken);
    }
  }, [isSuccess, data, setUser]);

  useEffect(() => {
    if (!isLoading) {
      authCheckAttempted.current = true;
    }
  }, [isLoading]);

  if (isLoading || !authCheckAttempted.current) {
    return ( kolko_ladowania...)
  }
  return <>{children}</>;
}

```

1. pobranie danych z api => zmiana stanu isLoading=False => Rerender CheckAuth
2. Ocenka warunku renderowania `if (isLoading || !authCheckAttempted.current) // authCheckAttempted dalej defaultowo false` => wychodzi true => dalej renderuje kolko ladowania
3. WYWOLANIE USEEFECTÓW - /**ustawienie stanu globalnego** + zmiana flagi authCheckAttempted na True/
4. Zmiana globalnego setUser(), z ktorego korzysta ChechAuth (useLoggedUserState) => drugi rerender CheckAuth
5. Ocenka warunku renderowania if (isLoading || !authCheckAttempted.current) => wychodzi false => renderowane są dzieci (RequireRole)
6. Globalny stan user jest już aktualny => RequireRole działa poprawnie

`const user = useLoggedUserState((state) => state.user);`
Zmian subskrybowanego stanu powoduje rerender komponentu!!!

useEffect wykonuje sie po zakonczonej fazie renderowania!!!

## useRef() - Persistent mutable value / Referencja do DOM

`const didRun = useRef(false);`

- wartosc jest stała - nieresetuje sie miedzy renderami
- zmiana wartosci nie powoduje reRenderu
- ten sam obiekt przez całe życie komponentu
- stosowany jako flaga logiczna

## Gdzie umiescic CheckAuth

```ts
<CheckAuth>
  <RouterProvider router={router} />
</CheckAuth>
```

1. Owija cała aplikacje
2. **CAŁA** aplikacja jest niewidoczna, dopóki autoryzacja nie zostanie w pełni sprawdzona
3. CheckAuth montuje się i działa tylko raz przy starcie aplikacji.

```tsx
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <CheckAuth>
        <Layout />
      </CheckAuth>
    ),
    children: [
      /* ... */
    ],
  },
  {
    // trasy publiczen ktore renderuja sie bez czekania na CheckAuth
    path: "/welcome",
    element: <WelcomePage />,
  },
]);
```

1. Pozwala nam wybrac trasy ktore maja czekac na CheckAuth

## watch w RHF

1. Formularz manualny z useState()

```ts
const [email, setEmail] = useState("");
<input value={email} onChange={(e) => setEmail(e.target.value)} />;
```

Kazda literka = re-render całego komponentu - **MAŁO WYDAJNE**

2. RHF przechowuje wartośći w **refach**, a nie w stanie ( ref = brak rerenderu)

3. watch('nazwa_pola') = mówi do RHF: "Dla tego pola rób wyjątek. Za każdym razem gdy się zmieni, wymuś re-render.

### watch() używamy gdy musimy coś wyświetlać na żywo (przed wysłaniem formsa)

## Default values w formsach

```ts
const ReportFaultScreen = () => {
  const form = useForm({
    defaultValues: { description: "", category: "" },
  });
```

1. Pozwalaja uniknac bledow z undefined
2. Fajnie wspolpracuja z `reset()`, który po wywolaniu przywraca pola do default values(Przydatne po udanej wysyłce formsa)
