// Password generation function
function generatePassword(length, options) {
    const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    const lowercaseChars = "abcdefghijklmnopqrstuvwxyz"
    const numberChars = "0123456789"
    const specialChars = "!@#$%^&*()_+-=[]{}|;:,.<>?"
    const ambiguousChars = "l1IO0"
  
    let chars = ""
    if (options.uppercase) chars += uppercaseChars
    if (options.lowercase) chars += lowercaseChars
    if (options.numbers) chars += numberChars
    if (options.special) chars += specialChars
  
    if (options.excludeAmbiguous) {
      chars = chars
        .split("")
        .filter((char) => !ambiguousChars.includes(char))
        .join("")
    }
  
    let password = ""
    const charArray = chars.split("")
  
    for (let i = 0; i < length; i++) {
      if (options.excludeDuplicates && password.length === charArray.length) {
        break
      }
  
      let char
      do {
        char = charArray[Math.floor(Math.random() * charArray.length)]
      } while (options.excludeDuplicates && password.includes(char))
  
      password += char
    }
  
    return password
  }
  
  // Function to escape HTML special characters
  function escapeHTML(str) {
    return str.replace(
      /[&<>'"]/g,
      (tag) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          "'": "&#39;",
          '"': "&quot;",
        })[tag] || tag,
    )
  }
  
  const availableLengths = [
    6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 32, 64, 128, 256, 512, 1024, 2048, 4096,
  ]
  
  function encodeSettings(settings) {
    const lengthIndex = availableLengths.indexOf(Number.parseInt(settings.length)).toString().padStart(2, "0")
    const count = settings.count.toString().padStart(3, "0")
    const booleanSettings = [
      settings.uppercase,
      settings.lowercase,
      settings.numbers,
      settings.special,
      settings.excludeDuplicates,
      settings.excludeAmbiguous,
    ]
      .map((setting) => (setting ? "1" : "0"))
      .join("")
  
    return `${lengthIndex}${count}${booleanSettings}`
  }
  
  function decodeSettings(encoded) {
    const lengthIndex = Number.parseInt(encoded.substr(0, 2))
    const count = Number.parseInt(encoded.substr(2, 3))
    const booleanSettings = encoded
      .substr(5)
      .split("")
      .map((char) => char === "1")
  
    return {
      length: availableLengths[lengthIndex].toString(),
      count: count.toString(),
      uppercase: booleanSettings[0],
      lowercase: booleanSettings[1],
      numbers: booleanSettings[2],
      special: booleanSettings[3],
      excludeDuplicates: booleanSettings[4],
      excludeAmbiguous: booleanSettings[5],
    }
  }
  
  // Main script
  document.addEventListener("DOMContentLoaded", () => {
    const lengthSelect = document.getElementById("length")
    const countInput = document.getElementById("count")
    const uppercaseCheckbox = document.getElementById("uppercase")
    const lowercaseCheckbox = document.getElementById("lowercase")
    const numbersCheckbox = document.getElementById("numbers")
    const specialCheckbox = document.getElementById("special")
    const excludeDuplicatesCheckbox = document.getElementById("excludeDuplicates")
    const excludeAmbiguousCheckbox = document.getElementById("excludeAmbiguous")
    const passwordList = document.getElementById("passwordList")
    const generateBtn = document.getElementById("generateBtn")
    const copySingleBtn = document.getElementById("copySingleBtn")
    const copyListBtn = document.getElementById("copyListBtn")
    const languageBtn = document.getElementById("languageBtn")
    const darkModeToggle = document.getElementById("darkModeToggle")
    const copySettingsBtn = document.getElementById("copySettingsBtn")
  
    let passwords = []
  
    generateBtn.addEventListener("click", () => {
      const length = Number.parseInt(lengthSelect.value)
      const count = Number.parseInt(countInput.value)
      const options = {
        uppercase: uppercaseCheckbox.checked,
        lowercase: lowercaseCheckbox.checked,
        numbers: numbersCheckbox.checked,
        special: specialCheckbox.checked,
        excludeDuplicates: excludeDuplicatesCheckbox.checked,
        excludeAmbiguous: excludeAmbiguousCheckbox.checked,
      }
  
      passwords = []
      for (let i = 0; i < count; i++) {
        passwords.push(generatePassword(length, options))
      }
  
      displayPasswords()
    })
  
    function displayPasswords() {
      passwordList.innerHTML = ""
      passwords.forEach((password, index) => {
        const passwordItem = document.createElement("div")
        passwordItem.classList.add("password-item")
        passwordItem.innerHTML = `
                  <span class="password-text">${escapeHTML(password)}</span>
                  <button class="copy-btn" data-index="${index}">Copy</button>
              `
        passwordList.appendChild(passwordItem)
      })
  
      // Add event listeners to individual copy buttons
      document.querySelectorAll(".copy-btn").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const index = e.target.getAttribute("data-index")
          copyToClipboard(passwords[index], e.target)
        })
      })
    }
  
    copySingleBtn.addEventListener("click", () => {
      if (passwords.length > 0) {
        copyToClipboard(passwords[0], copySingleBtn)
      } else {
        temporaryTextReplace(copySingleBtn, "No passwords!", 1000)
      }
    })
  
    copyListBtn.addEventListener("click", () => {
      if (passwords.length > 0) {
        copyToClipboard(passwords.join("\n"), copyListBtn)
      } else {
        temporaryTextReplace(copyListBtn, "No passwords!", 1000)
      }
    })
  
    languageBtn.addEventListener("click", () => {
      // Implement language switching logic here
      alert("Language switching not implemented in this version.")
    })
  
    function copyToClipboard(text, element) {
      const textarea = document.createElement("textarea")
      textarea.value = text
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand("copy")
      document.body.removeChild(textarea)
      temporaryTextReplace(element, "Copied!", 1000)
    }
  
    function temporaryTextReplace(element, newText, duration) {
      const originalText = element.textContent
      element.textContent = newText
      setTimeout(() => {
        element.textContent = originalText
      }, duration)
    }
  
    function toggleDarkMode() {
      document.documentElement.classList.toggle("dark")
      localStorage.setItem("darkMode", document.documentElement.classList.contains("dark"))
    }
  
    darkModeToggle.addEventListener("click", toggleDarkMode)
  
    // Check for saved dark mode preference
    if (localStorage.getItem("darkMode") === "true") {
      document.documentElement.classList.add("dark")
    } else if (localStorage.getItem("darkMode") === "false") {
      document.documentElement.classList.remove("dark")
    } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.documentElement.classList.add("dark")
    }
  
    copySettingsBtn.addEventListener("click", () => {
      const settingsLink = generateSettingsLink()
      copyToClipboard(settingsLink, copySettingsBtn)
    })
  
    function generateSettingsLink() {
      const settings = {
        length: lengthSelect.value,
        count: countInput.value,
        uppercase: uppercaseCheckbox.checked,
        lowercase: lowercaseCheckbox.checked,
        numbers: numbersCheckbox.checked,
        special: specialCheckbox.checked,
        excludeDuplicates: excludeDuplicatesCheckbox.checked,
        excludeAmbiguous: excludeAmbiguousCheckbox.checked,
      }
  
      const encoded = encodeSettings(settings)
      return `${window.location.origin}${window.location.pathname}?s=${encoded}`
    }
  
    function applySettingsFromURL() {
      const params = new URLSearchParams(window.location.search)
      if (params.has("s")) {
        const settings = decodeSettings(params.get("s"))
        lengthSelect.value = settings.length
        countInput.value = settings.count
        uppercaseCheckbox.checked = settings.uppercase
        lowercaseCheckbox.checked = settings.lowercase
        numbersCheckbox.checked = settings.numbers
        specialCheckbox.checked = settings.special
        excludeDuplicatesCheckbox.checked = settings.excludeDuplicates
        excludeAmbiguousCheckbox.checked = settings.excludeAmbiguous
      }
    }
  
    // Call this function when the page loads to apply settings from the URL
    applySettingsFromURL()
  })
  
  
