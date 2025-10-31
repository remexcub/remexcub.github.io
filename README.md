# 🚀 REMEXCUB - Migración a GitHub Pages

## 📋 Contenido de tu sitio web

Tu sitio ahora consta de 5 archivos HTML:

1. **index.html** - Página principal
2. **faq.html** - Preguntas frecuentes
3. **calculadora.html** - Calculadora de remesas
4. **pagos.html** - Métodos de pago
5. **testimonios.html** - Testimonios de clientes

---

## 🎯 PASO 1: Crear cuenta en GitHub (si no tienes)

1. Ve a: https://github.com
2. Click en **"Sign up"** (Registrarse)
3. Ingresa tu email, crea una contraseña
4. Verifica tu email

---

## 🎯 PASO 2: Crear un nuevo repositorio

1. Una vez en GitHub, click en el botón **"+"** arriba a la derecha
2. Selecciona **"New repository"**
3. **Repository name:** `remexcub.github.io` 
   - (⚠️ IMPORTANTE: usa este nombre exacto)
4. Descripción: "Sitio web REMEXCUB - Remesas a Cuba"
5. Selecciona **"Public"**
6. ✅ Marca **"Add a README file"**
7. Click en **"Create repository"**

---

## 🎯 PASO 3: Subir tus archivos

### Opción A: Subir archivos desde la interfaz web (MÁS FÁCIL)

1. En tu repositorio recién creado, click en **"Add file"** → **"Upload files"**
2. Arrastra y suelta TODOS estos 5 archivos:
   - index.html
   - faq.html
   - calculadora.html
   - pagos.html
   - testimonios.html
3. Escribe un mensaje: "Primer versión del sitio"
4. Click en **"Commit changes"**

---

## 🎯 PASO 4: Activar GitHub Pages

1. En tu repositorio, ve a **"Settings"** (Configuración)
2. En el menú lateral izquierdo, busca **"Pages"**
3. En **"Source"**, selecciona **"main"** (o "master")
4. Click en **"Save"**
5. Espera 1-2 minutos
6. ¡Tu sitio estará en: `https://TU-USUARIO.github.io/`

---

## 🎯 PASO 5: Conectar tu dominio remexcub.com

### En GitHub:

1. Ve a **Settings** → **Pages**
2. En **"Custom domain"**, escribe: `remexcub.com`
3. Click en **"Save"**
4. Espera a que aparezca un check verde (puede tardar unos minutos)

### En GoDaddy:

1. Entra a tu cuenta de GoDaddy
2. Ve a **"Mis Productos"** → **"DNS"** (o "Administrar DNS")
3. **ELIMINA** todos los registros A existentes
4. **AGREGA** estos 4 registros A:

```
Tipo: A    |  Nombre: @  |  Valor: 185.199.108.153
Tipo: A    |  Nombre: @  |  Valor: 185.199.109.153
Tipo: A    |  Nombre: @  |  Valor: 185.199.110.153
Tipo: A    |  Nombre: @  |  Valor: 185.199.111.153
```

5. **AGREGA** o **MODIFICA** el registro CNAME:

```
Tipo: CNAME  |  Nombre: www  |  Valor: TU-USUARIO.github.io
```

6. **Guarda los cambios**

⏰ **Espera 24-48 horas** para que los cambios de DNS se propaguen

---

## ✅ ¡LISTO! Ahora solo pagas el dominio

### 💰 Nuevo costo anual: $15-20 USD
### 💸 Ahorro: $150-300 USD/año

---

## 📝 Cómo editar tu sitio en el futuro

1. Ve a tu repositorio en GitHub
2. Click en el archivo que quieres editar
3. Click en el ícono del lápiz ✏️ (editar)
4. Haz tus cambios
5. Scroll abajo y click en **"Commit changes"**
6. Los cambios aparecerán en 1-2 minutos

---

## 🆘 AYUDA RÁPIDA

### Mi sitio no aparece
- Espera 5-10 minutos después de activar GitHub Pages
- Verifica que el nombre del repositorio sea correcto
- Asegúrate de que index.html esté en la raíz del repositorio

### El dominio no funciona
- DNS puede tardar hasta 48 horas en propagarse
- Verifica que los registros DNS estén correctos en GoDaddy
- En GitHub Pages, confirma que remexcub.com esté guardado

### Necesito hacer cambios
- Edita los archivos directamente en GitHub
- O descarga los archivos, edítalos y vuelve a subirlos

---

## 📞 ¿Necesitas ayuda?

Si tienes problemas con la migración, puedes:
1. Ver la documentación oficial: https://docs.github.com/es/pages
2. Contactar soporte de GitHub
3. Buscar tutoriales en YouTube: "GitHub Pages tutorial español"

---

## 🎉 ¡Felicidades!

Ahora tienes tu sitio funcionando de forma **GRATUITA** y solo pagas por el dominio.

**Beneficios:**
- ✅ Hosting gratis para siempre
- ✅ Sin límites de tráfico
- ✅ Rápido y confiable
- ✅ Fácil de actualizar
- ✅ HTTPS gratis automático

---

## 📦 Archivos incluidos

```
remexcub-site/
├── index.html        (Página principal)
├── faq.html          (Preguntas frecuentes)
├── calculadora.html  (Calculadora de remesas)
├── pagos.html        (Métodos de pago)
├── testimonios.html  (Testimonios)
└── README.md         (Este archivo)
```

---

**¡Mucho éxito con tu sitio web! 🚀**
