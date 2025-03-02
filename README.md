# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

````sh
¡Claro! Vamos a desglosar la lógica paso a paso para que entiendas cómo funciona y cómo se conectan las pantallas y los datos.

---

### **Objetivo General**
El objetivo es que el usuario seleccione una **categoría** y una **subcategoría** en la pantalla `SubcategoriesScreen`, y que esa subcategoría seleccionada se muestre en la pantalla `AddScreen` para que el usuario pueda usarla al agregar un producto.

---

### **Flujo de la Lógica**

1. **El usuario selecciona una subcategoría en `SubcategoriesScreen`**:
   - Cuando el usuario selecciona una subcategoría, esta se almacena en `AsyncStorage` (una forma de almacenamiento persistente en React Native).
   - Luego, el usuario es redirigido de regreso a `AddScreen`.

2. **En `AddScreen`, se recupera la subcategoría seleccionada**:
   - Al cargar `AddScreen`, se verifica si hay una subcategoría almacenada en `AsyncStorage`.
   - Si existe, se recupera y se muestra en la interfaz.

3. **El usuario completa el formulario en `AddScreen`**:
   - El usuario llena los campos del formulario (título, precio, descripción, etc.).
   - La subcategoría seleccionada se incluye automáticamente en los datos que se enviarán al backend.

4. **Después de agregar el producto, se limpia la subcategoría seleccionada**:
   - Una vez que el producto se ha agregado correctamente, se elimina la subcategoría almacenada en `AsyncStorage` para evitar que se reutilice en futuros productos.

---

### **Explicación Detallada de Cada Paso**

#### **1. Selección de la subcategoría en `SubcategoriesScreen`**

En `SubcategoriesScreen`, cuando el usuario selecciona una subcategoría, se ejecuta la función `handleSubcategoryPress`:

```javascript
const handleSubcategoryPress = async (categoryId, subcategoryId) => {
  try {
    // Obtener los detalles de la subcategoría desde el backend
    const response = await axios.get(
      `${API_BASE_URL}/subcategories/category/${categoryId}?subcategoryId=${subcategoryId}`
    );

    const subcategory = response.data;

    // Almacenar la subcategoría seleccionada en AsyncStorage
    await AsyncStorage.setItem(
      "selectedSubcategory",
      JSON.stringify(subcategory)
    );

    // Redirigir al usuario de regreso a AddScreen
    router.push("/add");
  } catch (error) {
    console.error("Error fetching subcategory:", error);
    Alert.alert("Error", "No se pudo cargar la subcategoría.");
  }
};
````

- **¿Qué hace esta función?**
  - Obtiene los detalles de la subcategoría seleccionada desde el backend.
  - Almacena la subcategoría en `AsyncStorage` usando `AsyncStorage.setItem`.
  - Redirige al usuario de regreso a `AddScreen` usando `router.push("/add")`.

---

#### **2. Recuperar la subcategoría en `AddScreen`**

En `AddScreen`, cuando la pantalla se carga, se verifica si hay una subcategoría almacenada en `AsyncStorage`:

```javascript
useEffect(() => {
  const getSelectedSubcategory = async () => {
    // Obtener la subcategoría almacenada en AsyncStorage
    const storedSubcategory = await AsyncStorage.getItem("selectedSubcategory");
    if (storedSubcategory) {
      // Si existe, actualizar el estado con la subcategoría
      setSelectedCategory(JSON.parse(storedSubcategory));
    }
  };
  getSelectedSubcategory();
}, []);
```

- **¿Qué hace este código?**
  - Usa `AsyncStorage.getItem` para recuperar la subcategoría almacenada.
  - Si existe, la convierte de JSON a un objeto con `JSON.parse` y la guarda en el estado `selectedCategory`.

---

#### **3. Mostrar la subcategoría seleccionada en `AddScreen`**

En `AddScreen`, la subcategoría seleccionada se muestra en un botón que permite al usuario seleccionar una categoría:

```javascript
<TouchableOpacity
  style={styles.selectorButton}
  onPress={() => router.push("/categorias/SubcategoriesScreen")}
>
  <Text style={styles.selectorText}>
    {selectedCategory ? selectedCategory.name : "Seleccionar categoría"}
  </Text>
  <Text style={styles.arrow}>▼</Text>
</TouchableOpacity>
```

- **¿Qué hace este código?**
  - Si `selectedCategory` tiene un valor, muestra el nombre de la subcategoría seleccionada.
  - Si no hay una subcategoría seleccionada, muestra el texto "Seleccionar categoría".
  - Al presionar el botón, el usuario es redirigido a `SubcategoriesScreen` para seleccionar una nueva subcategoría.

---

#### **4. Incluir la subcategoría en el formulario de `AddScreen`**

Cuando el usuario envía el formulario en `AddScreen`, la subcategoría seleccionada se incluye en los datos que se envían al backend:

```javascript
const AddPost = async () => {
  if (!validateForm()) {
    return;
  }

  setLoader(true);
  try {
    const endpoint = `${API_BASE_URL}/products`;

    const formDataToSend = new FormData();

    // Agregar los campos del formulario
    Object.keys(formData).forEach((key) => {
      if (formData[key]) {
        formDataToSend.append(key, formData[key]);
      }
    });

    // Agregar el ID del usuario
    if (userId) {
      formDataToSend.append("user", userId);
    }

    // Agregar la subcategoría seleccionada
    if (selectedCategory) {
      formDataToSend.append("category", selectedCategory._id);
    }

    // Agregar las imágenes
    images.forEach((imageUri, index) => {
      const uriParts = imageUri.split(".");
      const fileType = uriParts[uriParts.length - 1];
      formDataToSend.append("images", {
        uri: imageUri,
        name: `image-${index + 1}.${fileType}`,
        type: `image/${fileType}`,
      });
    });

    // Enviar los datos al backend
    const response = await axios.post(endpoint, formDataToSend, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.status === 201) {
      Alert.alert("Éxito", "Producto agregado exitosamente", [
        {
          text: "OK",
          onPress: () => {
            // Limpiar el formulario y la subcategoría seleccionada
            setFormData({
              title: "",
              supplier: "",
              price: "",
              product_location: "",
              description: "",
              phoneNumber: "",
              whatsapp: "",
            });
            setImages([]);
            AsyncStorage.removeItem("selectedSubcategory"); // Limpiar la subcategoría
            router.replace("(tabs)");
          },
        },
      ]);
    }
  } catch (error) {
    console.error("Error al agregar el producto:", error);
    Alert.alert("Error", "Hubo un error al agregar el producto");
  } finally {
    setLoader(false);
  }
};
```

- **¿Qué hace este código?**
  - Crea un objeto `FormData` para enviar los datos del formulario al backend.
  - Incluye la subcategoría seleccionada en los datos enviados.
  - Si el producto se agrega correctamente, limpia el formulario y elimina la subcategoría almacenada en `AsyncStorage`.

---

### **Resumen de la Lógica**

1. **Selección**: El usuario selecciona una subcategoría en `SubcategoriesScreen`, y esta se almacena en `AsyncStorage`.
2. **Recuperación**: En `AddScreen`, se recupera la subcategoría almacenada y se muestra en la interfaz.
3. **Uso**: La subcategoría se incluye automáticamente en los datos enviados al backend cuando el usuario agrega un producto.
4. **Limpieza**: Después de agregar el producto, se elimina la subcategoría almacenada para evitar reutilizarla.

---

### **¿Por qué usar `AsyncStorage`?**

`AsyncStorage` es una forma sencilla de almacenar datos persistentes en React Native. En este caso, se usa para guardar la subcategoría seleccionada, de modo que esté disponible incluso si el usuario cierra y vuelve a abrir la aplicación.

---

Espero que esta explicación te haya ayudado a entender cómo funciona la lógica. Si tienes más preguntas, ¡no dudes en preguntar! 😊

```

```
