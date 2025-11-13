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
