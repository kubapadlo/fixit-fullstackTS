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

## Wazny mechanizm przekazywania bledow

### Na froncie pamietac zeby rzucac bledy z wczescniej przygotowanym komunikatem z backendu

```ts
//backend
if (!isValid) {
  return res.status(401).json({ message: "Wrong password" });
}

//frontend
throw new Error(error.response?.data.message);
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
