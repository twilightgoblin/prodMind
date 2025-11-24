export const questionBanks = {
  java: [
    {
      question: "What is the main method signature in Java?",
      options: ["public static void main(String[] args)", "public void main(String[] args)", "static void main(String[] args)", "void main(String[] args)"],
      correctAnswer: "public static void main(String[] args)",
      explanation: "The main method must be public, static, void, and accept String array as parameter."
    },
    {
      question: "Which keyword is used to inherit a class in Java?",
      options: ["extends", "implements", "inherits", "super"],
      correctAnswer: "extends",
      explanation: "The 'extends' keyword is used for class inheritance in Java."
    },
    {
      question: "What is the default value of a boolean variable in Java?",
      options: ["false", "true", "0", "null"],
      correctAnswer: "false",
      explanation: "Boolean variables are initialized to false by default."
    },
    {
      question: "Which collection class allows duplicate elements?",
      options: ["ArrayList", "HashSet", "TreeSet", "LinkedHashSet"],
      correctAnswer: "ArrayList",
      explanation: "ArrayList allows duplicate elements, while Set implementations don't."
    },
    {
      question: "What is the purpose of the 'final' keyword?",
      options: ["Prevents modification", "Allows inheritance", "Creates constants", "Both A and C"],
      correctAnswer: "Both A and C",
      explanation: "The 'final' keyword prevents modification and is used to create constants."
    },
    {
      question: "Which exception is thrown when dividing by zero?",
      options: ["ArithmeticException", "NullPointerException", "NumberFormatException", "IllegalArgumentException"],
      correctAnswer: "ArithmeticException",
      explanation: "Division by zero throws ArithmeticException in Java."
    },
    {
      question: "What is polymorphism in Java?",
      options: ["Multiple forms of a method", "Multiple inheritance", "Method overloading only", "Class inheritance"],
      correctAnswer: "Multiple forms of a method",
      explanation: "Polymorphism allows methods to take multiple forms through overloading and overriding."
    },
    {
      question: "Which access modifier is most restrictive?",
      options: ["private", "protected", "public", "default"],
      correctAnswer: "private",
      explanation: "Private is the most restrictive access modifier, limiting access to the same class only."
    },
    {
      question: "What is the size of int in Java?",
      options: ["32 bits", "16 bits", "64 bits", "8 bits"],
      correctAnswer: "32 bits",
      explanation: "An int in Java is always 32 bits (4 bytes) regardless of platform."
    },
    {
      question: "Which interface must be implemented for a class to be used in a for-each loop?",
      options: ["Iterable", "Iterator", "Collection", "List"],
      correctAnswer: "Iterable",
      explanation: "A class must implement Iterable to be used in enhanced for loops."
    },
    {
      question: "What is the difference between == and equals()?",
      options: ["== compares references, equals() compares content", "Both are same", "== compares content, equals() compares references", "None"],
      correctAnswer: "== compares references, equals() compares content",
      explanation: "== checks reference equality while equals() checks logical equality."
    },
    {
      question: "Which keyword is used to prevent method overriding?",
      options: ["final", "static", "abstract", "private"],
      correctAnswer: "final",
      explanation: "A final method cannot be overridden by subclasses."
    },
    {
      question: "What is a constructor in Java?",
      options: ["Special method to initialize objects", "Regular method", "Static method", "Abstract method"],
      correctAnswer: "Special method to initialize objects",
      explanation: "Constructors are special methods called when creating new objects."
    },
    {
      question: "Which keyword is used to refer to the current object?",
      options: ["this", "self", "current", "me"],
      correctAnswer: "this",
      explanation: "The 'this' keyword refers to the current instance of the class."
    },
    {
      question: "What is the parent class of all classes in Java?",
      options: ["Object", "Class", "System", "Main"],
      correctAnswer: "Object",
      explanation: "All classes in Java implicitly extend the Object class."
    },
    {
      question: "Which loop is guaranteed to execute at least once?",
      options: ["do-while", "while", "for", "for-each"],
      correctAnswer: "do-while",
      explanation: "do-while loop checks condition after execution, ensuring at least one iteration."
    },
    {
      question: "What is method overloading?",
      options: ["Same method name, different parameters", "Same method name, same parameters", "Different method names", "Inheritance concept"],
      correctAnswer: "Same method name, different parameters",
      explanation: "Method overloading allows multiple methods with same name but different parameters."
    },
    {
      question: "Which collection maintains insertion order?",
      options: ["LinkedHashMap", "HashMap", "TreeMap", "HashSet"],
      correctAnswer: "LinkedHashMap",
      explanation: "LinkedHashMap maintains the order in which elements were inserted."
    },
    {
      question: "What is the purpose of the 'static' keyword?",
      options: ["Belongs to class, not instance", "Prevents modification", "Allows inheritance", "Creates constants"],
      correctAnswer: "Belongs to class, not instance",
      explanation: "Static members belong to the class itself rather than any specific instance."
    },
    {
      question: "Which exception is checked at compile time?",
      options: ["IOException", "NullPointerException", "ArithmeticException", "ArrayIndexOutOfBoundsException"],
      correctAnswer: "IOException",
      explanation: "IOException is a checked exception that must be handled at compile time."
    }
  ],

  cpp: [
    {
      question: "What is the correct syntax for a pointer in C++?",
      options: ["int *ptr;", "int ptr*;", "pointer int ptr;", "*int ptr;"],
      correctAnswer: "int *ptr;",
      explanation: "Pointers are declared with the asterisk before the variable name."
    },
    {
      question: "Which operator is used for dynamic memory allocation?",
      options: ["new", "malloc", "alloc", "create"],
      correctAnswer: "new",
      explanation: "The 'new' operator is used for dynamic memory allocation in C++."
    },
    {
      question: "What is the destructor syntax in C++?",
      options: ["~ClassName()", "delete ClassName()", "ClassName~()", "destroy ClassName()"],
      correctAnswer: "~ClassName()",
      explanation: "Destructors are prefixed with a tilde (~) and have the same name as the class."
    },
    {
      question: "What is the difference between struct and class in C++?",
      options: ["Default access: struct is public, class is private", "No difference", "struct cannot have methods", "class cannot have data"],
      correctAnswer: "Default access: struct is public, class is private",
      explanation: "The only difference is default access level: public for struct, private for class."
    },
    {
      question: "Which header file is needed for cout?",
      options: ["iostream", "stdio.h", "conio.h", "stdlib.h"],
      correctAnswer: "iostream",
      explanation: "iostream header provides cout for output operations."
    },
    {
      question: "What is function overloading?",
      options: ["Same function name, different parameters", "Same function, same parameters", "Different function names", "Virtual functions"],
      correctAnswer: "Same function name, different parameters",
      explanation: "Function overloading allows multiple functions with same name but different parameters."
    },
    {
      question: "Which keyword is used for inheritance?",
      options: [":", "extends", "inherits", "->"],
      correctAnswer: ":",
      explanation: "C++ uses colon (:) for inheritance syntax."
    },
    {
      question: "What is a virtual function?",
      options: ["Function that can be overridden", "Static function", "Inline function", "Friend function"],
      correctAnswer: "Function that can be overridden",
      explanation: "Virtual functions enable runtime polymorphism through overriding."
    },
    {
      question: "What is the size of a pointer in a 64-bit system?",
      options: ["8 bytes", "4 bytes", "2 bytes", "16 bytes"],
      correctAnswer: "8 bytes",
      explanation: "Pointers are 8 bytes (64 bits) on 64-bit systems."
    },
    {
      question: "Which operator is used to access members through a pointer?",
      options: ["->", ".", "::", "*"],
      correctAnswer: "->",
      explanation: "The arrow operator (->) is used to access members through pointers."
    },
    {
      question: "What is RAII in C++?",
      options: ["Resource Acquisition Is Initialization", "Random Access In Iteration", "Reference And Instance Initialization", "Runtime Allocation In Implementation"],
      correctAnswer: "Resource Acquisition Is Initialization",
      explanation: "RAII ties resource lifetime to object lifetime for automatic cleanup."
    },
    {
      question: "Which keyword prevents a class from being inherited?",
      options: ["final", "sealed", "static", "const"],
      correctAnswer: "final",
      explanation: "The final keyword prevents further inheritance of a class."
    },
    {
      question: "What is the purpose of the 'const' keyword?",
      options: ["Makes variables immutable", "Creates constants only", "Prevents inheritance", "Enables polymorphism"],
      correctAnswer: "Makes variables immutable",
      explanation: "const makes variables, pointers, or methods immutable."
    },
    {
      question: "What is a reference in C++?",
      options: ["Alias for another variable", "Pointer type", "Data type", "Memory address"],
      correctAnswer: "Alias for another variable",
      explanation: "References are aliases that must be initialized and cannot be reassigned."
    },
    {
      question: "Which operator is used for scope resolution?",
      options: ["::", ".", "->", "*"],
      correctAnswer: "::",
      explanation: "The scope resolution operator (::) accesses global or class members."
    },
    {
      question: "What is a template in C++?",
      options: ["Generic programming feature", "Class type", "Function type", "Pointer type"],
      correctAnswer: "Generic programming feature",
      explanation: "Templates enable generic programming with type parameters."
    },
    {
      question: "What is the difference between delete and delete[]?",
      options: ["delete for single object, delete[] for arrays", "No difference", "delete[] is faster", "delete is deprecated"],
      correctAnswer: "delete for single object, delete[] for arrays",
      explanation: "delete[] must be used for arrays to properly deallocate all elements."
    },
    {
      question: "What is a friend function?",
      options: ["Function that can access private members", "Member function", "Virtual function", "Static function"],
      correctAnswer: "Function that can access private members",
      explanation: "Friend functions can access private and protected members of a class."
    },
    {
      question: "Which STL container is FIFO?",
      options: ["queue", "stack", "vector", "map"],
      correctAnswer: "queue",
      explanation: "Queue follows First-In-First-Out (FIFO) principle."
    },
    {
      question: "What is the purpose of 'namespace'?",
      options: ["Avoid naming conflicts", "Create classes", "Define functions", "Allocate memory"],
      correctAnswer: "Avoid naming conflicts",
      explanation: "Namespaces organize code and prevent naming conflicts."
    }
  ],

  javascript: [
    {
      question: "What is the difference between let and var?",
      options: ["let is block-scoped, var is function-scoped", "No difference", "var is block-scoped", "let is global"],
      correctAnswer: "let is block-scoped, var is function-scoped",
      explanation: "let has block scope while var has function scope."
    },
    {
      question: "What is a closure in JavaScript?",
      options: ["Function with access to outer scope", "Loop construct", "Object type", "Array method"],
      correctAnswer: "Function with access to outer scope",
      explanation: "Closures allow functions to access variables from outer scopes."
    },
    {
      question: "What does '===' check in JavaScript?",
      options: ["Value and type equality", "Value equality only", "Reference equality", "Type equality only"],
      correctAnswer: "Value and type equality",
      explanation: "=== checks both value and type without type coercion."
    },
    {
      question: "What is the purpose of 'async/await'?",
      options: ["Handle asynchronous operations", "Create loops", "Define classes", "Declare variables"],
      correctAnswer: "Handle asynchronous operations",
      explanation: "async/await provides cleaner syntax for handling promises."
    },
    {
      question: "What is the output of typeof null?",
      options: ["object", "null", "undefined", "number"],
      correctAnswer: "object",
      explanation: "typeof null returns 'object' due to a historical JavaScript bug."
    },
    {
      question: "What is event bubbling?",
      options: ["Events propagate from child to parent", "Events propagate from parent to child", "Events don't propagate", "Events are cancelled"],
      correctAnswer: "Events propagate from child to parent",
      explanation: "Event bubbling means events travel up the DOM tree from target to root."
    },
    {
      question: "What is the purpose of 'this' keyword?",
      options: ["Refers to current execution context", "Creates variables", "Defines functions", "Imports modules"],
      correctAnswer: "Refers to current execution context",
      explanation: "'this' refers to the object in the current execution context."
    },
    {
      question: "What is a Promise in JavaScript?",
      options: ["Object representing async operation result", "Loop type", "Variable type", "Function type"],
      correctAnswer: "Object representing async operation result",
      explanation: "Promises represent the eventual completion or failure of async operations."
    },
    {
      question: "What does Array.map() return?",
      options: ["New array with transformed elements", "Modified original array", "Boolean value", "Single value"],
      correctAnswer: "New array with transformed elements",
      explanation: "map() creates a new array by applying a function to each element."
    },
    {
      question: "What is destructuring in JavaScript?",
      options: ["Extracting values from arrays/objects", "Deleting properties", "Creating objects", "Looping arrays"],
      correctAnswer: "Extracting values from arrays/objects",
      explanation: "Destructuring unpacks values from arrays or properties from objects."
    },
    {
      question: "What is the spread operator?",
      options: ["... (three dots)", "* (asterisk)", "& (ampersand)", "# (hash)"],
      correctAnswer: "... (three dots)",
      explanation: "The spread operator (...) expands iterables into individual elements."
    },
    {
      question: "What is hoisting in JavaScript?",
      options: ["Moving declarations to top of scope", "Deleting variables", "Creating functions", "Importing modules"],
      correctAnswer: "Moving declarations to top of scope",
      explanation: "Hoisting moves variable and function declarations to the top of their scope."
    },
    {
      question: "What is the difference between null and undefined?",
      options: ["null is assigned, undefined is default", "No difference", "undefined is assigned", "null is default"],
      correctAnswer: "null is assigned, undefined is default",
      explanation: "null is explicitly assigned while undefined is the default for uninitialized variables."
    },
    {
      question: "What is a callback function?",
      options: ["Function passed as argument", "Function that returns value", "Async function", "Arrow function"],
      correctAnswer: "Function passed as argument",
      explanation: "Callbacks are functions passed as arguments to be executed later."
    },
    {
      question: "What does JSON.parse() do?",
      options: ["Converts JSON string to object", "Converts object to JSON string", "Validates JSON", "Creates JSON"],
      correctAnswer: "Converts JSON string to object",
      explanation: "JSON.parse() parses a JSON string and returns a JavaScript object."
    },
    {
      question: "What is the purpose of 'use strict'?",
      options: ["Enables strict mode for safer code", "Improves performance", "Enables ES6 features", "Disables errors"],
      correctAnswer: "Enables strict mode for safer code",
      explanation: "Strict mode catches common coding mistakes and unsafe actions."
    },
    {
      question: "What is the difference between forEach and map?",
      options: ["map returns new array, forEach doesn't", "No difference", "forEach returns array", "map modifies original"],
      correctAnswer: "map returns new array, forEach doesn't",
      explanation: "map returns a new array while forEach just iterates without returning."
    },
    {
      question: "What is a template literal?",
      options: ["String with embedded expressions using backticks", "Regular string", "Array type", "Object type"],
      correctAnswer: "String with embedded expressions using backticks",
      explanation: "Template literals use backticks and allow embedded expressions with ${}."
    },
    {
      question: "What is the purpose of Object.freeze()?",
      options: ["Makes object immutable", "Deletes object", "Copies object", "Creates object"],
      correctAnswer: "Makes object immutable",
      explanation: "Object.freeze() prevents modifications to an object's properties."
    },
    {
      question: "What is event delegation?",
      options: ["Handling events on parent element", "Creating events", "Removing events", "Triggering events"],
      correctAnswer: "Handling events on parent element",
      explanation: "Event delegation uses bubbling to handle events on a parent instead of individual children."
    }
  ],

  nodejs: [
    {
      question: "What is Node.js?",
      options: ["JavaScript runtime built on Chrome's V8", "JavaScript framework", "Database", "Web browser"],
      correctAnswer: "JavaScript runtime built on Chrome's V8",
      explanation: "Node.js is a runtime environment for executing JavaScript outside browsers."
    },
    {
      question: "What is npm?",
      options: ["Node Package Manager", "Node Programming Module", "New Project Manager", "Node Process Manager"],
      correctAnswer: "Node Package Manager",
      explanation: "npm is the default package manager for Node.js."
    },
    {
      question: "What is the purpose of package.json?",
      options: ["Manages project dependencies and metadata", "Stores code", "Configures database", "Defines routes"],
      correctAnswer: "Manages project dependencies and metadata",
      explanation: "package.json contains project metadata and dependency information."
    },
    {
      question: "What is the Event Loop in Node.js?",
      options: ["Handles asynchronous operations", "Creates events", "Loops through arrays", "Manages memory"],
      correctAnswer: "Handles asynchronous operations",
      explanation: "The Event Loop manages asynchronous callbacks and non-blocking I/O."
    },
    {
      question: "What is middleware in Express?",
      options: ["Functions that process requests", "Database layer", "Frontend component", "Testing tool"],
      correctAnswer: "Functions that process requests",
      explanation: "Middleware functions have access to request and response objects in the pipeline."
    },
    {
      question: "What does require() do?",
      options: ["Imports modules", "Exports modules", "Creates modules", "Deletes modules"],
      correctAnswer: "Imports modules",
      explanation: "require() is used to import modules in Node.js."
    },
    {
      question: "What is the difference between process.nextTick() and setImmediate()?",
      options: ["nextTick executes before I/O, setImmediate after", "No difference", "setImmediate is faster", "nextTick is deprecated"],
      correctAnswer: "nextTick executes before I/O, setImmediate after",
      explanation: "process.nextTick() executes before I/O events, setImmediate() after."
    },
    {
      question: "What is a Buffer in Node.js?",
      options: ["Handles binary data", "Text storage", "Array type", "Object type"],
      correctAnswer: "Handles binary data",
      explanation: "Buffers are used to handle binary data in Node.js."
    },
    {
      question: "What is the purpose of module.exports?",
      options: ["Exports module content", "Imports modules", "Creates modules", "Deletes modules"],
      correctAnswer: "Exports module content",
      explanation: "module.exports defines what a module exports for use in other files."
    },
    {
      question: "What is clustering in Node.js?",
      options: ["Running multiple Node processes", "Grouping data", "Database feature", "Frontend technique"],
      correctAnswer: "Running multiple Node processes",
      explanation: "Clustering allows running multiple Node.js processes to utilize multiple CPU cores."
    },
    {
      question: "What is the purpose of the 'fs' module?",
      options: ["File system operations", "Network operations", "Database operations", "Math operations"],
      correctAnswer: "File system operations",
      explanation: "The fs module provides APIs for interacting with the file system."
    },
    {
      question: "What is a stream in Node.js?",
      options: ["Objects for handling flowing data", "Database connection", "HTTP method", "Array type"],
      correctAnswer: "Objects for handling flowing data",
      explanation: "Streams handle reading or writing data piece by piece instead of all at once."
    },
    {
      question: "What is the purpose of process.env?",
      options: ["Access environment variables", "Process data", "Create variables", "Delete variables"],
      correctAnswer: "Access environment variables",
      explanation: "process.env provides access to environment variables."
    },
    {
      question: "What is callback hell?",
      options: ["Nested callbacks making code hard to read", "Error in callbacks", "Async function", "Promise chain"],
      correctAnswer: "Nested callbacks making code hard to read",
      explanation: "Callback hell refers to deeply nested callbacks that reduce code readability."
    },
    {
      question: "What is the purpose of __dirname?",
      options: ["Current directory path", "File name", "Module name", "Process ID"],
      correctAnswer: "Current directory path",
      explanation: "__dirname contains the absolute path of the directory containing the current file."
    },
    {
      question: "What is Express.js?",
      options: ["Web framework for Node.js", "Database", "Testing tool", "Package manager"],
      correctAnswer: "Web framework for Node.js",
      explanation: "Express is a minimal and flexible Node.js web application framework."
    },
    {
      question: "What is the purpose of body-parser?",
      options: ["Parse incoming request bodies", "Parse URLs", "Parse headers", "Parse cookies"],
      correctAnswer: "Parse incoming request bodies",
      explanation: "body-parser middleware parses incoming request bodies before handlers."
    },
    {
      question: "What is REPL in Node.js?",
      options: ["Read-Eval-Print-Loop interactive shell", "Database tool", "Testing framework", "Build tool"],
      correctAnswer: "Read-Eval-Print-Loop interactive shell",
      explanation: "REPL provides an interactive environment for executing JavaScript."
    },
    {
      question: "What is the purpose of nodemon?",
      options: ["Auto-restart server on file changes", "Package manager", "Testing tool", "Database tool"],
      correctAnswer: "Auto-restart server on file changes",
      explanation: "nodemon automatically restarts the application when file changes are detected."
    },
    {
      question: "What is the difference between dependencies and devDependencies?",
      options: ["dependencies for production, devDependencies for development", "No difference", "devDependencies are faster", "dependencies are optional"],
      correctAnswer: "dependencies for production, devDependencies for development",
      explanation: "dependencies are needed in production, devDependencies only in development."
    }
  ],

  python: [
    {
      question: "What is the correct way to create a list in Python?",
      options: ["[1, 2, 3]", "{1, 2, 3}", "(1, 2, 3)", "<1, 2, 3>"],
      correctAnswer: "[1, 2, 3]",
      explanation: "Lists are created using square brackets []."
    },
    {
      question: "What is the difference between list and tuple?",
      options: ["List is mutable, tuple is immutable", "No difference", "Tuple is mutable", "List is faster"],
      correctAnswer: "List is mutable, tuple is immutable",
      explanation: "Lists can be modified after creation, tuples cannot."
    },
    {
      question: "What is a dictionary in Python?",
      options: ["Key-value pair collection", "Ordered list", "Set of values", "String type"],
      correctAnswer: "Key-value pair collection",
      explanation: "Dictionaries store data as key-value pairs."
    },
    {
      question: "What does the 'self' parameter represent?",
      options: ["Instance of the class", "Class itself", "Parent class", "Module"],
      correctAnswer: "Instance of the class",
      explanation: "self refers to the instance of the class in methods."
    },
    {
      question: "What is list comprehension?",
      options: ["Concise way to create lists", "List method", "Loop type", "Function type"],
      correctAnswer: "Concise way to create lists",
      explanation: "List comprehension provides a compact syntax for creating lists."
    },
    {
      question: "What is the purpose of __init__?",
      options: ["Constructor method", "Destructor method", "Static method", "Class method"],
      correctAnswer: "Constructor method",
      explanation: "__init__ is the constructor method called when creating objects."
    },
    {
      question: "What is the difference between '==' and 'is'?",
      options: ["== compares values, is compares identity", "No difference", "is compares values", "== compares identity"],
      correctAnswer: "== compares values, is compares identity",
      explanation: "== checks value equality while 'is' checks object identity."
    },
    {
      question: "What is a lambda function?",
      options: ["Anonymous function", "Named function", "Class method", "Module function"],
      correctAnswer: "Anonymous function",
      explanation: "Lambda functions are small anonymous functions defined with lambda keyword."
    },
    {
      question: "What does the 'with' statement do?",
      options: ["Context management for resources", "Loop construct", "Conditional statement", "Import statement"],
      correctAnswer: "Context management for resources",
      explanation: "with statement ensures proper acquisition and release of resources."
    },
    {
      question: "What is the purpose of *args?",
      options: ["Variable number of arguments", "Pointer", "Multiplication", "Power operator"],
      correctAnswer: "Variable number of arguments",
      explanation: "*args allows functions to accept variable number of positional arguments."
    },
    {
      question: "What is the purpose of **kwargs?",
      options: ["Variable number of keyword arguments", "Power operator", "Dictionary", "List"],
      correctAnswer: "Variable number of keyword arguments",
      explanation: "**kwargs allows functions to accept variable number of keyword arguments."
    },
    {
      question: "What is a decorator in Python?",
      options: ["Function that modifies another function", "Class type", "Module type", "Variable type"],
      correctAnswer: "Function that modifies another function",
      explanation: "Decorators modify or enhance functions without changing their code."
    },
    {
      question: "What is the difference between append() and extend()?",
      options: ["append adds single element, extend adds multiple", "No difference", "extend adds single element", "append is faster"],
      correctAnswer: "append adds single element, extend adds multiple",
      explanation: "append() adds one element, extend() adds multiple elements from an iterable."
    },
    {
      question: "What is a generator in Python?",
      options: ["Function that yields values lazily", "List type", "Dictionary type", "Class type"],
      correctAnswer: "Function that yields values lazily",
      explanation: "Generators yield values one at a time using yield keyword."
    },
    {
      question: "What is the purpose of pass statement?",
      options: ["Placeholder for empty code blocks", "Skip iteration", "Exit function", "Raise error"],
      correctAnswer: "Placeholder for empty code blocks",
      explanation: "pass is a null operation used as a placeholder."
    },
    {
      question: "What is the difference between remove() and pop()?",
      options: ["remove by value, pop by index", "No difference", "pop by value", "remove by index"],
      correctAnswer: "remove by value, pop by index",
      explanation: "remove() removes first occurrence of value, pop() removes by index."
    },
    {
      question: "What is a set in Python?",
      options: ["Unordered collection of unique elements", "Ordered list", "Key-value pairs", "String type"],
      correctAnswer: "Unordered collection of unique elements",
      explanation: "Sets store unique elements in no particular order."
    },
    {
      question: "What is the purpose of try-except?",
      options: ["Exception handling", "Loop construct", "Function definition", "Class definition"],
      correctAnswer: "Exception handling",
      explanation: "try-except blocks handle exceptions and errors gracefully."
    },
    {
      question: "What is the difference between shallow and deep copy?",
      options: ["Shallow copies references, deep copies values", "No difference", "Deep copies references", "Shallow is faster"],
      correctAnswer: "Shallow copies references, deep copies values",
      explanation: "Shallow copy copies references, deep copy creates independent copies."
    },
    {
      question: "What is the purpose of enumerate()?",
      options: ["Get index and value in loops", "Count elements", "Sort list", "Filter list"],
      correctAnswer: "Get index and value in loops",
      explanation: "enumerate() returns index and value pairs when iterating."
    }
  ],

  typescript: [
    {
      question: "What is TypeScript?",
      options: ["Typed superset of JavaScript", "JavaScript framework", "Database", "Testing tool"],
      correctAnswer: "Typed superset of JavaScript",
      explanation: "TypeScript adds static typing to JavaScript."
    },
    {
      question: "What is the purpose of interfaces?",
      options: ["Define object structure", "Create classes", "Import modules", "Handle errors"],
      correctAnswer: "Define object structure",
      explanation: "Interfaces define the shape of objects and contracts."
    },
    {
      question: "What is the 'any' type?",
      options: ["Disables type checking", "String type", "Number type", "Boolean type"],
      correctAnswer: "Disables type checking",
      explanation: "any type opts out of type checking and allows any value."
    },
    {
      question: "What is the difference between interface and type?",
      options: ["Interfaces can be extended, types are more flexible", "No difference", "Types can be extended", "Interfaces are deprecated"],
      correctAnswer: "Interfaces can be extended, types are more flexible",
      explanation: "Interfaces support declaration merging, types support unions and intersections."
    },
    {
      question: "What is a generic in TypeScript?",
      options: ["Type parameter for reusable code", "Class type", "Function type", "Variable type"],
      correctAnswer: "Type parameter for reusable code",
      explanation: "Generics allow creating reusable components with type parameters."
    },
    {
      question: "What is the purpose of 'readonly'?",
      options: ["Makes properties immutable", "Makes properties private", "Makes properties public", "Makes properties optional"],
      correctAnswer: "Makes properties immutable",
      explanation: "readonly modifier prevents property modification after initialization."
    },
    {
      question: "What is a union type?",
      options: ["Type that can be one of several types", "Combined types", "Array type", "Object type"],
      correctAnswer: "Type that can be one of several types",
      explanation: "Union types allow a value to be one of several types using |."
    },
    {
      question: "What is type assertion?",
      options: ["Telling compiler about type", "Type checking", "Type conversion", "Type creation"],
      correctAnswer: "Telling compiler about type",
      explanation: "Type assertions tell the compiler to treat a value as a specific type."
    },
    {
      question: "What is the 'never' type?",
      options: ["Type for values that never occur", "Null type", "Undefined type", "Any type"],
      correctAnswer: "Type for values that never occur",
      explanation: "never represents values that never occur, like functions that always throw."
    },
    {
      question: "What is an enum in TypeScript?",
      options: ["Named set of constants", "Array type", "Object type", "Function type"],
      correctAnswer: "Named set of constants",
      explanation: "Enums define a set of named constants."
    },
    {
      question: "What is the purpose of 'as const'?",
      options: ["Creates literal types", "Type assertion", "Constant declaration", "Type guard"],
      correctAnswer: "Creates literal types",
      explanation: "as const creates readonly literal types from values."
    },
    {
      question: "What is a type guard?",
      options: ["Runtime check for types", "Compile-time check", "Type definition", "Type conversion"],
      correctAnswer: "Runtime check for types",
      explanation: "Type guards narrow types at runtime using conditional checks."
    },
    {
      question: "What is the 'unknown' type?",
      options: ["Type-safe alternative to any", "Same as any", "Null type", "Undefined type"],
      correctAnswer: "Type-safe alternative to any",
      explanation: "unknown is type-safe and requires type checking before use."
    },
    {
      question: "What is an intersection type?",
      options: ["Combines multiple types", "Separates types", "Array type", "Union type"],
      correctAnswer: "Combines multiple types",
      explanation: "Intersection types combine multiple types using &."
    },
    {
      question: "What is the purpose of 'keyof'?",
      options: ["Gets keys of a type", "Creates keys", "Deletes keys", "Checks keys"],
      correctAnswer: "Gets keys of a type",
      explanation: "keyof operator produces a union of property names."
    },
    {
      question: "What is a mapped type?",
      options: ["Transforms properties of a type", "Array method", "Object method", "Function type"],
      correctAnswer: "Transforms properties of a type",
      explanation: "Mapped types create new types by transforming properties."
    },
    {
      question: "What is the 'Partial' utility type?",
      options: ["Makes all properties optional", "Makes all properties required", "Makes all properties readonly", "Removes properties"],
      correctAnswer: "Makes all properties optional",
      explanation: "Partial<T> makes all properties of T optional."
    },
    {
      question: "What is the 'Required' utility type?",
      options: ["Makes all properties required", "Makes all properties optional", "Makes all properties readonly", "Removes properties"],
      correctAnswer: "Makes all properties required",
      explanation: "Required<T> makes all properties of T required."
    },
    {
      question: "What is the purpose of 'extends' in generics?",
      options: ["Constrains generic types", "Inherits types", "Creates types", "Deletes types"],
      correctAnswer: "Constrains generic types",
      explanation: "extends in generics adds constraints to type parameters."
    },
    {
      question: "What is a tuple in TypeScript?",
      options: ["Fixed-length array with typed elements", "Dynamic array", "Object type", "String type"],
      correctAnswer: "Fixed-length array with typed elements",
      explanation: "Tuples are arrays with fixed length and specific types for each position."
    }
  ],

  express: [
    {
      question: "What is Express.js?",
      options: ["Web framework for Node.js", "Database", "Frontend framework", "Testing tool"],
      correctAnswer: "Web framework for Node.js",
      explanation: "Express is a minimal web application framework for Node.js."
    },
    {
      question: "What is middleware in Express?",
      options: ["Functions that process requests", "Database layer", "Frontend component", "Route handler"],
      correctAnswer: "Functions that process requests",
      explanation: "Middleware functions have access to request, response, and next in the pipeline."
    },
    {
      question: "What does app.use() do?",
      options: ["Mounts middleware", "Creates routes", "Starts server", "Closes server"],
      correctAnswer: "Mounts middleware",
      explanation: "app.use() mounts middleware functions at specified paths."
    },
    {
      question: "What is the purpose of next()?",
      options: ["Pass control to next middleware", "End response", "Start server", "Create route"],
      correctAnswer: "Pass control to next middleware",
      explanation: "next() passes control to the next middleware function."
    },
    {
      question: "What is the difference between app.get() and app.use()?",
      options: ["get is for GET requests, use is for all methods", "No difference", "use is for GET only", "get is for all methods"],
      correctAnswer: "get is for GET requests, use is for all methods",
      explanation: "app.get() handles GET requests, app.use() handles all HTTP methods."
    },
    {
      question: "What is req.params used for?",
      options: ["Access route parameters", "Access query strings", "Access request body", "Access headers"],
      correctAnswer: "Access route parameters",
      explanation: "req.params contains route parameters from the URL path."
    },
    {
      question: "What is req.query used for?",
      options: ["Access query string parameters", "Access route parameters", "Access request body", "Access headers"],
      correctAnswer: "Access query string parameters",
      explanation: "req.query contains parsed query string parameters."
    },
    {
      question: "What is req.body used for?",
      options: ["Access request body data", "Access query strings", "Access route parameters", "Access headers"],
      correctAnswer: "Access request body data",
      explanation: "req.body contains data sent in the request body."
    },
    {
      question: "What is the purpose of express.json()?",
      options: ["Parse JSON request bodies", "Send JSON responses", "Create JSON", "Validate JSON"],
      correctAnswer: "Parse JSON request bodies",
      explanation: "express.json() is middleware that parses JSON request bodies."
    },
    {
      question: "What is the purpose of express.static()?",
      options: ["Serve static files", "Create routes", "Parse data", "Handle errors"],
      correctAnswer: "Serve static files",
      explanation: "express.static() serves static files like images, CSS, and JavaScript."
    },
    {
      question: "What is the purpose of res.send()?",
      options: ["Send response", "Receive request", "Create route", "Start server"],
      correctAnswer: "Send response",
      explanation: "res.send() sends the HTTP response."
    },
    {
      question: "What is the difference between res.send() and res.json()?",
      options: ["json sets Content-Type to application/json", "No difference", "send is faster", "json is deprecated"],
      correctAnswer: "json sets Content-Type to application/json",
      explanation: "res.json() automatically sets Content-Type header to application/json."
    },
    {
      question: "What is the purpose of res.status()?",
      options: ["Set HTTP status code", "Get status", "Send response", "Create route"],
      correctAnswer: "Set HTTP status code",
      explanation: "res.status() sets the HTTP status code for the response."
    },
    {
      question: "What is error-handling middleware?",
      options: ["Middleware with 4 parameters (err, req, res, next)", "Regular middleware", "Route handler", "Static middleware"],
      correctAnswer: "Middleware with 4 parameters (err, req, res, next)",
      explanation: "Error-handling middleware has 4 parameters including err as first parameter."
    },
    {
      question: "What is the purpose of app.listen()?",
      options: ["Start server on specified port", "Stop server", "Create routes", "Handle requests"],
      correctAnswer: "Start server on specified port",
      explanation: "app.listen() binds and listens for connections on specified port."
    },
    {
      question: "What is route chaining?",
      options: ["Multiple handlers for same route", "Multiple routes", "Nested routes", "Route parameters"],
      correctAnswer: "Multiple handlers for same route",
      explanation: "Route chaining allows multiple middleware functions for the same route."
    },
    {
      question: "What is the purpose of express.Router()?",
      options: ["Create modular route handlers", "Create server", "Parse data", "Handle errors"],
      correctAnswer: "Create modular route handlers",
      explanation: "express.Router() creates modular, mountable route handlers."
    },
    {
      question: "What is the purpose of res.redirect()?",
      options: ["Redirect to different URL", "Send response", "Create route", "Handle error"],
      correctAnswer: "Redirect to different URL",
      explanation: "res.redirect() redirects the request to a different URL."
    },
    {
      question: "What is the purpose of app.all()?",
      options: ["Handle all HTTP methods", "Handle GET only", "Handle POST only", "Handle errors"],
      correctAnswer: "Handle all HTTP methods",
      explanation: "app.all() matches all HTTP methods for a route."
    },
    {
      question: "What is the purpose of res.render()?",
      options: ["Render view template", "Send JSON", "Send file", "Redirect"],
      correctAnswer: "Render view template",
      explanation: "res.render() renders a view template and sends HTML response."
    }
  ],

  react: [
    {
      question: "What is React?",
      options: ["JavaScript library for building UIs", "Backend framework", "Database", "Testing tool"],
      correctAnswer: "JavaScript library for building UIs",
      explanation: "React is a JavaScript library for building user interfaces."
    },
    {
      question: "What is JSX?",
      options: ["JavaScript XML syntax extension", "JavaScript framework", "CSS preprocessor", "Testing tool"],
      correctAnswer: "JavaScript XML syntax extension",
      explanation: "JSX is a syntax extension that allows writing HTML-like code in JavaScript."
    },
    {
      question: "What is a component in React?",
      options: ["Reusable piece of UI", "Database table", "API endpoint", "CSS class"],
      correctAnswer: "Reusable piece of UI",
      explanation: "Components are independent, reusable pieces of UI."
    },
    {
      question: "What is the difference between state and props?",
      options: ["State is mutable, props are immutable", "No difference", "Props are mutable", "State is immutable"],
      correctAnswer: "State is mutable, props are immutable",
      explanation: "State can be changed within a component, props are passed from parent."
    },
    {
      question: "What is the purpose of useState?",
      options: ["Manage component state", "Manage side effects", "Manage context", "Manage refs"],
      correctAnswer: "Manage component state",
      explanation: "useState hook allows functional components to have state."
    },
    {
      question: "What is the purpose of useEffect?",
      options: ["Handle side effects", "Manage state", "Create refs", "Handle events"],
      correctAnswer: "Handle side effects",
      explanation: "useEffect handles side effects like data fetching and subscriptions."
    },
    {
      question: "What is the virtual DOM?",
      options: ["Lightweight copy of actual DOM", "Real DOM", "Database", "API"],
      correctAnswer: "Lightweight copy of actual DOM",
      explanation: "Virtual DOM is a lightweight representation used for efficient updates."
    },
    {
      question: "What is the purpose of keys in lists?",
      options: ["Help React identify changed items", "Style elements", "Add events", "Create components"],
      correctAnswer: "Help React identify changed items",
      explanation: "Keys help React identify which items have changed, added, or removed."
    },
    {
      question: "What is prop drilling?",
      options: ["Passing props through multiple levels", "Creating props", "Deleting props", "Validating props"],
      correctAnswer: "Passing props through multiple levels",
      explanation: "Prop drilling is passing props through intermediate components."
    },
    {
      question: "What is the Context API?",
      options: ["Share data without prop drilling", "Create components", "Handle events", "Manage routes"],
      correctAnswer: "Share data without prop drilling",
      explanation: "Context API provides a way to share values between components without props."
    },
    {
      question: "What is the purpose of useRef?",
      options: ["Access DOM elements directly", "Manage state", "Handle effects", "Create context"],
      correctAnswer: "Access DOM elements directly",
      explanation: "useRef provides a way to access DOM nodes or persist values."
    },
    {
      question: "What is the purpose of useMemo?",
      options: ["Memoize expensive calculations", "Manage state", "Handle effects", "Create refs"],
      correctAnswer: "Memoize expensive calculations",
      explanation: "useMemo memoizes values to avoid expensive recalculations."
    },
    {
      question: "What is the purpose of useCallback?",
      options: ["Memoize callback functions", "Create callbacks", "Handle events", "Manage state"],
      correctAnswer: "Memoize callback functions",
      explanation: "useCallback memoizes functions to prevent unnecessary re-renders."
    },
    {
      question: "What is a controlled component?",
      options: ["Component with form data controlled by React", "Uncontrolled component", "Class component", "Functional component"],
      correctAnswer: "Component with form data controlled by React",
      explanation: "Controlled components have form data handled by React state."
    },
    {
      question: "What is React.Fragment?",
      options: ["Group elements without extra DOM node", "Component type", "Hook", "Context"],
      correctAnswer: "Group elements without extra DOM node",
      explanation: "Fragment lets you group elements without adding extra DOM nodes."
    },
    {
      question: "What is the purpose of React.memo?",
      options: ["Prevent unnecessary re-renders", "Manage state", "Handle effects", "Create context"],
      correctAnswer: "Prevent unnecessary re-renders",
      explanation: "React.memo memoizes components to prevent unnecessary re-renders."
    },
    {
      question: "What is lazy loading in React?",
      options: ["Load components on demand", "Eager loading", "Preloading", "Caching"],
      correctAnswer: "Load components on demand",
      explanation: "Lazy loading defers component loading until needed."
    },
    {
      question: "What is the purpose of Suspense?",
      options: ["Handle loading states", "Manage state", "Handle errors", "Create routes"],
      correctAnswer: "Handle loading states",
      explanation: "Suspense lets components wait for something before rendering."
    },
    {
      question: "What is the purpose of Error Boundaries?",
      options: ["Catch JavaScript errors in components", "Handle HTTP errors", "Validate props", "Manage state"],
      correctAnswer: "Catch JavaScript errors in components",
      explanation: "Error Boundaries catch errors in component tree and display fallback UI."
    },
    {
      question: "What is the difference between class and functional components?",
      options: ["Class uses lifecycle methods, functional uses hooks", "No difference", "Functional uses lifecycle", "Class uses hooks"],
      correctAnswer: "Class uses lifecycle methods, functional uses hooks",
      explanation: "Class components use lifecycle methods, functional components use hooks."
    }
  ],

  nextjs: [
    {
      question: "What is Next.js?",
      options: ["React framework with SSR", "Backend framework", "Database", "Testing tool"],
      correctAnswer: "React framework with SSR",
      explanation: "Next.js is a React framework with server-side rendering capabilities."
    },
    {
      question: "What is the purpose of getServerSideProps?",
      options: ["Fetch data on each request", "Fetch data at build time", "Client-side fetching", "Static generation"],
      correctAnswer: "Fetch data on each request",
      explanation: "getServerSideProps fetches data on each request for SSR."
    },
    {
      question: "What is the purpose of getStaticProps?",
      options: ["Fetch data at build time", "Fetch data on each request", "Client-side fetching", "Dynamic rendering"],
      correctAnswer: "Fetch data at build time",
      explanation: "getStaticProps fetches data at build time for static generation."
    },
    {
      question: "What is the purpose of getStaticPaths?",
      options: ["Define dynamic routes for static generation", "Create routes", "Handle navigation", "Fetch data"],
      correctAnswer: "Define dynamic routes for static generation",
      explanation: "getStaticPaths specifies which dynamic routes to pre-render."
    },
    {
      question: "What is the pages directory?",
      options: ["File-based routing system", "Component folder", "API folder", "Config folder"],
      correctAnswer: "File-based routing system",
      explanation: "Files in pages directory automatically become routes."
    },
    {
      question: "What is the purpose of _app.js?",
      options: ["Custom App component for all pages", "API route", "Config file", "Layout component"],
      correctAnswer: "Custom App component for all pages",
      explanation: "_app.js wraps all pages and persists layout between page changes."
    },
    {
      question: "What is the purpose of _document.js?",
      options: ["Customize HTML document structure", "App component", "API route", "Page component"],
      correctAnswer: "Customize HTML document structure",
      explanation: "_document.js customizes the HTML document structure."
    },
    {
      question: "What is API Routes in Next.js?",
      options: ["Backend API endpoints in pages/api", "Frontend routes", "Database routes", "External APIs"],
      correctAnswer: "Backend API endpoints in pages/api",
      explanation: "API Routes allow creating backend endpoints in pages/api directory."
    },
    {
      question: "What is Image component in Next.js?",
      options: ["Optimized image component", "Regular img tag", "Icon component", "Background component"],
      correctAnswer: "Optimized image component",
      explanation: "Next.js Image component provides automatic image optimization."
    },
    {
      question: "What is Link component used for?",
      options: ["Client-side navigation", "External links", "API calls", "Image links"],
      correctAnswer: "Client-side navigation",
      explanation: "Link component enables client-side navigation between pages."
    },
    {
      question: "What is Incremental Static Regeneration (ISR)?",
      options: ["Update static pages after build", "Build all pages", "Server-side rendering", "Client-side rendering"],
      correctAnswer: "Update static pages after build",
      explanation: "ISR allows updating static pages without rebuilding entire site."
    },
    {
      question: "What is the purpose of next.config.js?",
      options: ["Configure Next.js settings", "Define routes", "Create pages", "Handle API"],
      correctAnswer: "Configure Next.js settings",
      explanation: "next.config.js is the configuration file for Next.js."
    },
    {
      question: "What is middleware in Next.js?",
      options: ["Run code before request completion", "API handler", "Page component", "Layout component"],
      correctAnswer: "Run code before request completion",
      explanation: "Middleware runs code before a request is completed."
    },
    {
      question: "What is the app directory in Next.js 13+?",
      options: ["New routing system with layouts", "Old pages directory", "API directory", "Config directory"],
      correctAnswer: "New routing system with layouts",
      explanation: "App directory introduces new routing with nested layouts and server components."
    },
    {
      question: "What are Server Components?",
      options: ["Components rendered on server", "Client components", "API components", "Static components"],
      correctAnswer: "Components rendered on server",
      explanation: "Server Components render on the server and don't send JavaScript to client."
    },
    {
      question: "What is the purpose of 'use client' directive?",
      options: ["Mark component as client component", "Mark as server component", "API directive", "Config directive"],
      correctAnswer: "Mark component as client component",
      explanation: "'use client' marks a component to run on the client side."
    },
    {
      question: "What is dynamic routing in Next.js?",
      options: ["Routes with parameters using [param]", "Static routes", "API routes", "External routes"],
      correctAnswer: "Routes with parameters using [param]",
      explanation: "Dynamic routes use brackets [param] for route parameters."
    },
    {
      question: "What is the purpose of Head component?",
      options: ["Modify page head/metadata", "Page header", "Navigation", "Footer"],
      correctAnswer: "Modify page head/metadata",
      explanation: "Head component modifies page metadata like title and meta tags."
    },
    {
      question: "What is the difference between SSR and SSG?",
      options: ["SSR renders per request, SSG at build time", "No difference", "SSG renders per request", "SSR at build time"],
      correctAnswer: "SSR renders per request, SSG at build time",
      explanation: "SSR renders on each request, SSG generates pages at build time."
    },
    {
      question: "What is the purpose of fallback in getStaticPaths?",
      options: ["Handle paths not generated at build", "Error handling", "Loading state", "Redirect"],
      correctAnswer: "Handle paths not generated at build",
      explanation: "fallback determines behavior for paths not returned by getStaticPaths."
    },
    {
      question: "What is the purpose of router.push()?",
      options: ["Navigate programmatically", "Add route", "Remove route", "Check route"],
      correctAnswer: "Navigate programmatically",
      explanation: "router.push() allows programmatic navigation to different routes."
    },
    {
      question: "What is the purpose of router.query?",
      options: ["Access query parameters", "Set query parameters", "Remove query parameters", "Check query parameters"],
      correctAnswer: "Access query parameters",
      explanation: "router.query provides access to URL query parameters."
    },
    {
      question: "What is the purpose of getInitialProps?",
      options: ["Fetch data for SSR (legacy)", "Fetch data at build time", "Client-side fetching", "Static generation"],
      correctAnswer: "Fetch data for SSR (legacy)",
      explanation: "getInitialProps is a legacy method for fetching data (use getServerSideProps instead)."
    },
    {
      question: "What is the purpose of next/script?",
      options: ["Optimize third-party scripts", "Run scripts", "Create scripts", "Delete scripts"],
      correctAnswer: "Optimize third-party scripts",
      explanation: "next/script component optimizes loading of third-party scripts."
    },
    {
      question: "What is the purpose of next/font?",
      options: ["Optimize font loading", "Create fonts", "Delete fonts", "Check fonts"],
      correctAnswer: "Optimize font loading",
      explanation: "next/font automatically optimizes and loads fonts."
    },
    {
      question: "What are Server Actions?",
      options: ["Server-side functions callable from client", "Client actions", "API routes", "Middleware"],
      correctAnswer: "Server-side functions callable from client",
      explanation: "Server Actions allow calling server-side functions directly from client components."
    },
    {
      question: "What is the purpose of loading.js?",
      options: ["Show loading UI", "Load data", "Load components", "Load routes"],
      correctAnswer: "Show loading UI",
      explanation: "loading.js creates loading UI for route segments."
    },
    {
      question: "What is the purpose of error.js?",
      options: ["Handle errors in route segment", "Create errors", "Log errors", "Prevent errors"],
      correctAnswer: "Handle errors in route segment",
      explanation: "error.js creates error UI for route segments."
    },
    {
      question: "What is the purpose of layout.js?",
      options: ["Define shared UI for routes", "Create routes", "Handle navigation", "Fetch data"],
      correctAnswer: "Define shared UI for routes",
      explanation: "layout.js defines UI that is shared between multiple routes."
    },
    {
      question: "What is the purpose of template.js?",
      options: ["Similar to layout but re-renders", "Create templates", "Define routes", "Handle errors"],
      correctAnswer: "Similar to layout but re-renders",
      explanation: "template.js is like layout but creates a new instance on navigation."
    }
  ],

  // New language: Go
  go: [
    {
      question: "What is a goroutine?",
      options: ["Lightweight thread", "Function", "Package", "Variable"],
      correctAnswer: "Lightweight thread",
      explanation: "Goroutines are lightweight threads managed by Go runtime."
    },
    {
      question: "What is a channel in Go?",
      options: ["Communication between goroutines", "Data structure", "Function type", "Package"],
      correctAnswer: "Communication between goroutines",
      explanation: "Channels provide a way for goroutines to communicate and synchronize."
    },
    {
      question: "What is the purpose of defer?",
      options: ["Execute function after surrounding function returns", "Delay execution", "Error handling", "Loop control"],
      correctAnswer: "Execute function after surrounding function returns",
      explanation: "defer schedules a function call to run after the surrounding function completes."
    },
    {
      question: "What is an interface in Go?",
      options: ["Set of method signatures", "Class type", "Struct type", "Function type"],
      correctAnswer: "Set of method signatures",
      explanation: "Interfaces define a set of method signatures that types can implement."
    },
    {
      question: "What is the difference between := and =?",
      options: [":= declares and assigns, = only assigns", "No difference", "= declares and assigns", ":= only assigns"],
      correctAnswer: ":= declares and assigns, = only assigns",
      explanation: ":= is short variable declaration, = is assignment to existing variables."
    },
    {
      question: "What is a struct in Go?",
      options: ["Collection of fields", "Function type", "Interface", "Channel"],
      correctAnswer: "Collection of fields",
      explanation: "Structs are typed collections of fields for grouping data."
    },
    {
      question: "What is the purpose of make() function?",
      options: ["Initialize slices, maps, channels", "Create structs", "Define functions", "Import packages"],
      correctAnswer: "Initialize slices, maps, channels",
      explanation: "make() initializes and allocates memory for slices, maps, and channels."
    },
    {
      question: "What is the difference between slice and array?",
      options: ["Slice is dynamic, array is fixed size", "No difference", "Array is dynamic", "Slice is fixed"],
      correctAnswer: "Slice is dynamic, array is fixed size",
      explanation: "Arrays have fixed size, slices are dynamic views into arrays."
    },
    {
      question: "What is a pointer in Go?",
      options: ["Variable storing memory address", "Function reference", "Package reference", "Interface"],
      correctAnswer: "Variable storing memory address",
      explanation: "Pointers hold the memory address of a value."
    },
    {
      question: "What is the purpose of go keyword?",
      options: ["Start a goroutine", "Import package", "Define function", "Create variable"],
      correctAnswer: "Start a goroutine",
      explanation: "go keyword starts a new goroutine for concurrent execution."
    },
    {
      question: "What is panic in Go?",
      options: ["Runtime error that stops execution", "Warning", "Log message", "Debug tool"],
      correctAnswer: "Runtime error that stops execution",
      explanation: "panic stops normal execution and begins panicking."
    },
    {
      question: "What is recover in Go?",
      options: ["Regain control after panic", "Error handling", "Memory recovery", "Goroutine restart"],
      correctAnswer: "Regain control after panic",
      explanation: "recover regains control of a panicking goroutine."
    },
    {
      question: "What is a method in Go?",
      options: ["Function with receiver argument", "Regular function", "Interface method", "Package function"],
      correctAnswer: "Function with receiver argument",
      explanation: "Methods are functions with a special receiver argument."
    },
    {
      question: "What is the blank identifier _?",
      options: ["Ignore values", "Variable name", "Function name", "Package name"],
      correctAnswer: "Ignore values",
      explanation: "_ is used to ignore values in assignments."
    },
    {
      question: "What is a package in Go?",
      options: ["Collection of source files", "Function group", "Variable group", "Class"],
      correctAnswer: "Collection of source files",
      explanation: "Packages are collections of source files in the same directory."
    },
    {
      question: "What is the init() function?",
      options: ["Initialization function run before main", "Constructor", "Destructor", "Main function"],
      correctAnswer: "Initialization function run before main",
      explanation: "init() runs automatically before main() for initialization."
    },
    {
      question: "What is a map in Go?",
      options: ["Key-value data structure", "Array type", "Slice type", "Struct type"],
      correctAnswer: "Key-value data structure",
      explanation: "Maps are unordered collections of key-value pairs."
    },
    {
      question: "What is the range keyword used for?",
      options: ["Iterate over arrays, slices, maps", "Define range", "Create range", "Check range"],
      correctAnswer: "Iterate over arrays, slices, maps",
      explanation: "range iterates over elements in various data structures."
    },
    {
      question: "What is embedding in Go?",
      options: ["Composition mechanism", "Inheritance", "Interface implementation", "Package import"],
      correctAnswer: "Composition mechanism",
      explanation: "Embedding allows composing types by including other types."
    },
    {
      question: "What is the select statement?",
      options: ["Choose between channel operations", "Switch statement", "If statement", "Loop statement"],
      correctAnswer: "Choose between channel operations",
      explanation: "select lets a goroutine wait on multiple channel operations."
    }
  ],

  // New language: Rust
  rust: [
    {
      question: "What is ownership in Rust?",
      options: ["Memory management system", "Variable scope", "Function type", "Module system"],
      correctAnswer: "Memory management system",
      explanation: "Ownership is Rust's unique memory management system without garbage collection."
    },
    {
      question: "What is borrowing in Rust?",
      options: ["Temporary access to data", "Copying data", "Moving data", "Deleting data"],
      correctAnswer: "Temporary access to data",
      explanation: "Borrowing allows references to data without taking ownership."
    },
    {
      question: "What is the difference between &T and &mut T?",
      options: ["&T is immutable reference, &mut T is mutable", "No difference", "&mut T is immutable", "&T is mutable"],
      correctAnswer: "&T is immutable reference, &mut T is mutable",
      explanation: "&T is an immutable reference, &mut T is a mutable reference."
    },
    {
      question: "What is a lifetime in Rust?",
      options: ["Scope for which reference is valid", "Variable duration", "Function duration", "Program duration"],
      correctAnswer: "Scope for which reference is valid",
      explanation: "Lifetimes ensure references are valid for their entire scope."
    },
    {
      question: "What is the Option type?",
      options: ["Type that may or may not have a value", "Error type", "Array type", "String type"],
      correctAnswer: "Type that may or may not have a value",
      explanation: "Option represents an optional value: Some(T) or None."
    },
    {
      question: "What is the Result type?",
      options: ["Type for operations that can fail", "Success type", "Option type", "Error type"],
      correctAnswer: "Type for operations that can fail",
      explanation: "Result represents success (Ok) or failure (Err)."
    },
    {
      question: "What is a trait in Rust?",
      options: ["Shared behavior definition", "Class", "Struct", "Enum"],
      correctAnswer: "Shared behavior definition",
      explanation: "Traits define shared behavior similar to interfaces."
    },
    {
      question: "What is pattern matching?",
      options: ["Control flow based on patterns", "String matching", "Type matching", "Variable matching"],
      correctAnswer: "Control flow based on patterns",
      explanation: "Pattern matching allows checking values against patterns."
    },
    {
      question: "What is the purpose of match expression?",
      options: ["Exhaustive pattern matching", "String comparison", "Type checking", "Error handling"],
      correctAnswer: "Exhaustive pattern matching",
      explanation: "match provides exhaustive pattern matching on values."
    },
    {
      question: "What is a closure in Rust?",
      options: ["Anonymous function", "Named function", "Struct method", "Trait method"],
      correctAnswer: "Anonymous function",
      explanation: "Closures are anonymous functions that can capture their environment."
    },
    {
      question: "What is the difference between String and &str?",
      options: ["String is owned, &str is borrowed", "No difference", "&str is owned", "String is borrowed"],
      correctAnswer: "String is owned, &str is borrowed",
      explanation: "String is an owned, growable string, &str is a string slice."
    },
    {
      question: "What is a macro in Rust?",
      options: ["Code generation tool", "Function", "Variable", "Type"],
      correctAnswer: "Code generation tool",
      explanation: "Macros generate code at compile time."
    },
    {
      question: "What is the purpose of impl keyword?",
      options: ["Implement methods or traits", "Import module", "Define interface", "Create instance"],
      correctAnswer: "Implement methods or traits",
      explanation: "impl is used to implement methods on types or traits for types."
    },
    {
      question: "What is a vector in Rust?",
      options: ["Growable array", "Fixed array", "Linked list", "Hash map"],
      correctAnswer: "Growable array",
      explanation: "Vec<T> is a growable, heap-allocated array."
    },
    {
      question: "What is the purpose of unwrap()?",
      options: ["Extract value or panic", "Wrap value", "Check value", "Convert value"],
      correctAnswer: "Extract value or panic",
      explanation: "unwrap() extracts the value from Option/Result or panics."
    },
    {
      question: "What is cargo?",
      options: ["Rust package manager and build tool", "Compiler", "Runtime", "Debugger"],
      correctAnswer: "Rust package manager and build tool",
      explanation: "Cargo is Rust's package manager and build system."
    },
    {
      question: "What is the difference between struct and enum?",
      options: ["struct groups data, enum represents variants", "No difference", "enum groups data", "struct represents variants"],
      correctAnswer: "struct groups data, enum represents variants",
      explanation: "Structs group related data, enums represent one of several variants."
    },
    {
      question: "What is the purpose of derive attribute?",
      options: ["Auto-implement traits", "Define traits", "Create traits", "Import traits"],
      correctAnswer: "Auto-implement traits",
      explanation: "derive automatically implements traits for types."
    },
    {
      question: "What is a reference in Rust?",
      options: ["Pointer that borrows data", "Owned pointer", "Copy of data", "Move of data"],
      correctAnswer: "Pointer that borrows data",
      explanation: "References borrow data without taking ownership."
    },
    {
      question: "What is the purpose of Box<T>?",
      options: ["Heap allocation", "Stack allocation", "Reference counting", "Garbage collection"],
      correctAnswer: "Heap allocation",
      explanation: "Box<T> provides heap allocation for data."
    }
  ],

  // New language: PHP
  php: [
    {
      question: "What does PHP stand for?",
      options: ["PHP: Hypertext Preprocessor", "Personal Home Page", "Private Home Page", "Public Hypertext Processor"],
      correctAnswer: "PHP: Hypertext Preprocessor",
      explanation: "PHP is a recursive acronym for PHP: Hypertext Preprocessor."
    },
    {
      question: "How do you start a PHP code block?",
      options: ["<?php", "<php>", "<?", "<script>"],
      correctAnswer: "<?php",
      explanation: "PHP code blocks start with <?php and end with ?>."
    },
    {
      question: "What is the difference between echo and print?",
      options: ["echo can output multiple values, print returns 1", "No difference", "print is faster", "echo returns value"],
      correctAnswer: "echo can output multiple values, print returns 1",
      explanation: "echo can take multiple parameters, print returns 1 and takes one argument."
    },
    {
      question: "What is the purpose of $ symbol?",
      options: ["Denotes variables", "String concatenation", "Comment", "Function call"],
      correctAnswer: "Denotes variables",
      explanation: "$ is used to declare and reference variables in PHP."
    },
    {
      question: "What is the difference between == and ===?",
      options: ["== compares values, === compares values and types", "No difference", "=== compares values only", "== compares types"],
      correctAnswer: "== compares values, === compares values and types",
      explanation: "== checks value equality, === checks value and type equality."
    },
    {
      question: "What is an associative array?",
      options: ["Array with named keys", "Indexed array", "Multidimensional array", "Object array"],
      correctAnswer: "Array with named keys",
      explanation: "Associative arrays use named keys instead of numeric indices."
    },
    {
      question: "What is the purpose of $_GET?",
      options: ["Access URL parameters", "Get form data", "Get cookies", "Get session data"],
      correctAnswer: "Access URL parameters",
      explanation: "$_GET is a superglobal array for accessing URL query parameters."
    },
    {
      question: "What is the purpose of $_POST?",
      options: ["Access form data sent via POST", "Access URL parameters", "Access cookies", "Access session data"],
      correctAnswer: "Access form data sent via POST",
      explanation: "$_POST contains data sent via HTTP POST method."
    },
    {
      question: "What is the purpose of include vs require?",
      options: ["require causes fatal error if file missing", "No difference", "include causes fatal error", "require is optional"],
      correctAnswer: "require causes fatal error if file missing",
      explanation: "require produces fatal error if file not found, include produces warning."
    },
    {
      question: "What is a namespace in PHP?",
      options: ["Organize code and avoid name conflicts", "Variable scope", "Function group", "Class inheritance"],
      correctAnswer: "Organize code and avoid name conflicts",
      explanation: "Namespaces provide a way to group related classes and functions."
    },
    {
      question: "What is the purpose of __construct()?",
      options: ["Constructor method", "Destructor method", "Magic method", "Static method"],
      correctAnswer: "Constructor method",
      explanation: "__construct() is called when creating a new object instance."
    },
    {
      question: "What is the difference between public, private, and protected?",
      options: ["Access level modifiers", "Variable types", "Function types", "Class types"],
      correctAnswer: "Access level modifiers",
      explanation: "They control visibility: public (everywhere), private (class only), protected (class and subclasses)."
    },
    {
      question: "What is PDO in PHP?",
      options: ["PHP Data Objects for database access", "PHP Development Object", "PHP Data Operation", "PHP Database Operator"],
      correctAnswer: "PHP Data Objects for database access",
      explanation: "PDO provides a consistent interface for accessing databases."
    },
    {
      question: "What is the purpose of session_start()?",
      options: ["Initialize session", "End session", "Check session", "Delete session"],
      correctAnswer: "Initialize session",
      explanation: "session_start() creates or resumes a session."
    },
    {
      question: "What is the difference between isset() and empty()?",
      options: ["isset checks if set, empty checks if empty", "No difference", "empty checks if set", "isset checks if empty"],
      correctAnswer: "isset checks if set, empty checks if empty",
      explanation: "isset() checks if variable is set, empty() checks if variable is empty."
    },
    {
      question: "What is a trait in PHP?",
      options: ["Mechanism for code reuse", "Class type", "Interface", "Abstract class"],
      correctAnswer: "Mechanism for code reuse",
      explanation: "Traits enable horizontal code reuse in single inheritance."
    },
    {
      question: "What is the purpose of final keyword?",
      options: ["Prevent method overriding or class inheritance", "Define constants", "End execution", "Close connection"],
      correctAnswer: "Prevent method overriding or class inheritance",
      explanation: "final prevents methods from being overridden or classes from being extended."
    },
    {
      question: "What is the purpose of static keyword?",
      options: ["Belongs to class, not instance", "Prevents modification", "Creates constants", "Defines scope"],
      correctAnswer: "Belongs to class, not instance",
      explanation: "static members belong to the class rather than instances."
    },
    {
      question: "What is the purpose of abstract class?",
      options: ["Define common interface for subclasses", "Create objects", "Define constants", "Handle errors"],
      correctAnswer: "Define common interface for subclasses",
      explanation: "Abstract classes provide a template for subclasses."
    },
    {
      question: "What is the purpose of interface?",
      options: ["Define contract for classes", "Create objects", "Define variables", "Handle errors"],
      correctAnswer: "Define contract for classes",
      explanation: "Interfaces define a contract that implementing classes must follow."
    }
  ],

  // New languages with questions
  ruby: [
    { question: "What is a symbol in Ruby?", options: ["Immutable identifier", "Variable", "String", "Number"], correctAnswer: "Immutable identifier", explanation: "Symbols are immutable, reusable identifiers prefixed with :." },
    { question: "What is the difference between puts and print?", options: ["puts adds newline, print doesn't", "No difference", "print adds newline", "puts is faster"], correctAnswer: "puts adds newline, print doesn't", explanation: "puts adds a newline after output, print doesn't." },
    { question: "What is a block in Ruby?", options: ["Anonymous function passed to methods", "Code section", "Class definition", "Module"], correctAnswer: "Anonymous function passed to methods", explanation: "Blocks are chunks of code enclosed in {} or do...end." },
    { question: "What is the purpose of yield?", options: ["Execute block passed to method", "Return value", "Create variable", "Define method"], correctAnswer: "Execute block passed to method", explanation: "yield executes the block passed to a method." },
    { question: "What is a module in Ruby?", options: ["Collection of methods and constants", "Class", "Function", "Variable"], correctAnswer: "Collection of methods and constants", explanation: "Modules are collections of methods and constants for namespacing and mixins." },
    { question: "What is the purpose of attr_accessor?", options: ["Create getter and setter methods", "Access attributes", "Define attributes", "Delete attributes"], correctAnswer: "Create getter and setter methods", explanation: "attr_accessor automatically creates getter and setter methods." },
    { question: "What is string interpolation?", options: ["Embed expressions in strings with #{}", "Concatenate strings", "Format strings", "Parse strings"], correctAnswer: "Embed expressions in strings with #{}", explanation: "String interpolation embeds expressions in strings using #{}." },
    { question: "What is the purpose of each method?", options: ["Iterate over collection", "Create array", "Filter array", "Sort array"], correctAnswer: "Iterate over collection", explanation: "each iterates over each element in a collection." },
    { question: "What is a hash in Ruby?", options: ["Key-value collection", "Array", "String", "Number"], correctAnswer: "Key-value collection", explanation: "Hashes are collections of key-value pairs." },
    { question: "What is the purpose of initialize method?", options: ["Constructor for objects", "Destructor", "Class method", "Module method"], correctAnswer: "Constructor for objects", explanation: "initialize is called when creating new objects." }
  ],

  swift: [
    { question: "What is Swift?", options: ["Programming language for iOS/macOS", "JavaScript framework", "Database", "Web server"], correctAnswer: "Programming language for iOS/macOS", explanation: "Swift is Apple's programming language for iOS, macOS, and other platforms." },
    { question: "What is an optional in Swift?", options: ["Type that may or may not have a value", "Required value", "Constant", "Variable"], correctAnswer: "Type that may or may not have a value", explanation: "Optionals represent a value that might be nil." },
    { question: "What is the difference between let and var?", options: ["let is constant, var is variable", "No difference", "var is constant", "let is variable"], correctAnswer: "let is constant, var is variable", explanation: "let declares constants, var declares variables." },
    { question: "What is a closure in Swift?", options: ["Self-contained block of functionality", "Class", "Struct", "Enum"], correctAnswer: "Self-contained block of functionality", explanation: "Closures are self-contained blocks of code that can be passed around." },
    { question: "What is the purpose of guard statement?", options: ["Early exit from function", "Loop control", "Error handling", "Type checking"], correctAnswer: "Early exit from function", explanation: "guard provides early exit when conditions aren't met." },
    { question: "What is the difference between struct and class?", options: ["struct is value type, class is reference type", "No difference", "class is value type", "struct is reference type"], correctAnswer: "struct is value type, class is reference type", explanation: "Structs are value types (copied), classes are reference types." },
    { question: "What is a protocol in Swift?", options: ["Blueprint of methods and properties", "Class", "Struct", "Enum"], correctAnswer: "Blueprint of methods and properties", explanation: "Protocols define a blueprint of methods, properties, and requirements." },
    { question: "What is extension in Swift?", options: ["Add functionality to existing types", "Inherit from type", "Create new type", "Delete type"], correctAnswer: "Add functionality to existing types", explanation: "Extensions add new functionality to existing types." },
    { question: "What is the purpose of weak keyword?", options: ["Prevent retain cycles", "Create weak variables", "Delete references", "Check references"], correctAnswer: "Prevent retain cycles", explanation: "weak prevents strong reference cycles in memory management." },
    { question: "What is a tuple in Swift?", options: ["Group multiple values", "Array", "Dictionary", "Set"], correctAnswer: "Group multiple values", explanation: "Tuples group multiple values into a single compound value." }
  ],

  kotlin: [
    { question: "What is Kotlin?", options: ["JVM language for Android", "JavaScript framework", "Database", "Web server"], correctAnswer: "JVM language for Android", explanation: "Kotlin is a modern programming language that runs on the JVM." },
    { question: "What is the difference between val and var?", options: ["val is immutable, var is mutable", "No difference", "var is immutable", "val is mutable"], correctAnswer: "val is immutable, var is mutable", explanation: "val declares read-only variables, var declares mutable variables." },
    { question: "What is null safety in Kotlin?", options: ["Type system prevents null pointer exceptions", "Null checking", "Null handling", "Null conversion"], correctAnswer: "Type system prevents null pointer exceptions", explanation: "Kotlin's type system distinguishes nullable and non-nullable types." },
    { question: "What is the purpose of ? operator?", options: ["Declare nullable type", "Ternary operator", "Elvis operator", "Safe call"], correctAnswer: "Declare nullable type", explanation: "? makes a type nullable, allowing it to hold null." },
    { question: "What is the Elvis operator?", options: ["?: provides default for null", "? operator", "!! operator", "?. operator"], correctAnswer: "?: provides default for null", explanation: "?: returns right side if left side is null." },
    { question: "What is a data class?", options: ["Class for holding data", "Regular class", "Abstract class", "Interface"], correctAnswer: "Class for holding data", explanation: "Data classes automatically generate equals, hashCode, toString, and copy." },
    { question: "What is the purpose of when expression?", options: ["Pattern matching like switch", "Loop", "Conditional", "Function"], correctAnswer: "Pattern matching like switch", explanation: "when is a powerful pattern matching expression." },
    { question: "What is a lambda in Kotlin?", options: ["Anonymous function", "Named function", "Class method", "Interface method"], correctAnswer: "Anonymous function", explanation: "Lambdas are anonymous functions that can be passed as values." },
    { question: "What is the purpose of let function?", options: ["Execute block on non-null object", "Create variable", "Define function", "Check null"], correctAnswer: "Execute block on non-null object", explanation: "let executes a block on a non-null object." },
    { question: "What is a sealed class?", options: ["Restricted class hierarchy", "Final class", "Abstract class", "Open class"], correctAnswer: "Restricted class hierarchy", explanation: "Sealed classes restrict inheritance to a known set of subclasses." }
  ],

  csharp: [
    { question: "What is C#?", options: ["Object-oriented language for .NET", "C variant", "JavaScript framework", "Database language"], correctAnswer: "Object-oriented language for .NET", explanation: "C# is a modern, object-oriented language developed by Microsoft for .NET." },
    { question: "What is the difference between class and struct?", options: ["class is reference type, struct is value type", "No difference", "struct is reference type", "class is value type"], correctAnswer: "class is reference type, struct is value type", explanation: "Classes are reference types, structs are value types." },
    { question: "What is a namespace?", options: ["Organize code and prevent naming conflicts", "Variable scope", "Function group", "Class container"], correctAnswer: "Organize code and prevent naming conflicts", explanation: "Namespaces organize code and prevent naming conflicts." },
    { question: "What is the purpose of using statement?", options: ["Import namespace or dispose resources", "Use variable", "Call method", "Create object"], correctAnswer: "Import namespace or dispose resources", explanation: "using imports namespaces or ensures proper disposal of resources." },
    { question: "What is a property in C#?", options: ["Member with get/set accessors", "Variable", "Method", "Field"], correctAnswer: "Member with get/set accessors", explanation: "Properties provide flexible mechanism to read, write, or compute values." },
    { question: "What is the purpose of async/await?", options: ["Asynchronous programming", "Synchronous programming", "Threading", "Parallel processing"], correctAnswer: "Asynchronous programming", explanation: "async/await simplifies asynchronous programming." },
    { question: "What is LINQ?", options: ["Language Integrated Query", "Link Query", "List Query", "Loop Query"], correctAnswer: "Language Integrated Query", explanation: "LINQ provides query capabilities directly in C#." },
    { question: "What is the purpose of delegate?", options: ["Type-safe function pointer", "Delegate task", "Create object", "Define method"], correctAnswer: "Type-safe function pointer", explanation: "Delegates are type-safe function pointers." },
    { question: "What is an event in C#?", options: ["Notification mechanism", "Function", "Variable", "Class"], correctAnswer: "Notification mechanism", explanation: "Events provide a way for objects to notify other objects." },
    { question: "What is a nullable type?", options: ["Value type that can be null", "Reference type", "Null type", "Optional type"], correctAnswer: "Value type that can be null", explanation: "Nullable types allow value types to represent null." }
  ],

  sql: [
    { question: "What does SQL stand for?", options: ["Structured Query Language", "Simple Query Language", "Standard Query Language", "System Query Language"], correctAnswer: "Structured Query Language", explanation: "SQL stands for Structured Query Language." },
    { question: "What is the purpose of SELECT statement?", options: ["Retrieve data from database", "Insert data", "Update data", "Delete data"], correctAnswer: "Retrieve data from database", explanation: "SELECT retrieves data from one or more tables." },
    { question: "What is the purpose of WHERE clause?", options: ["Filter records", "Sort records", "Group records", "Join tables"], correctAnswer: "Filter records", explanation: "WHERE filters records based on specified conditions." },
    { question: "What is a PRIMARY KEY?", options: ["Unique identifier for records", "Foreign key", "Index", "Constraint"], correctAnswer: "Unique identifier for records", explanation: "PRIMARY KEY uniquely identifies each record in a table." },
    { question: "What is a FOREIGN KEY?", options: ["Links tables together", "Primary key", "Unique key", "Index"], correctAnswer: "Links tables together", explanation: "FOREIGN KEY creates a link between two tables." },
    { question: "What is the purpose of JOIN?", options: ["Combine rows from multiple tables", "Filter data", "Sort data", "Group data"], correctAnswer: "Combine rows from multiple tables", explanation: "JOIN combines rows from two or more tables based on related columns." },
    { question: "What is the purpose of GROUP BY?", options: ["Group rows with same values", "Sort rows", "Filter rows", "Join tables"], correctAnswer: "Group rows with same values", explanation: "GROUP BY groups rows that have the same values." },
    { question: "What is the purpose of ORDER BY?", options: ["Sort result set", "Group results", "Filter results", "Join tables"], correctAnswer: "Sort result set", explanation: "ORDER BY sorts the result set in ascending or descending order." },
    { question: "What is an INDEX?", options: ["Improves query performance", "Primary key", "Foreign key", "Constraint"], correctAnswer: "Improves query performance", explanation: "Indexes improve the speed of data retrieval operations." },
    { question: "What is the purpose of COUNT()?", options: ["Count number of rows", "Sum values", "Average values", "Find maximum"], correctAnswer: "Count number of rows", explanation: "COUNT() returns the number of rows that match criteria." }
  ],

  mongodb: [
    { question: "What is MongoDB?", options: ["NoSQL document database", "SQL database", "Key-value store", "Graph database"], correctAnswer: "NoSQL document database", explanation: "MongoDB is a document-oriented NoSQL database." },
    { question: "What is a document in MongoDB?", options: ["JSON-like data structure", "Table row", "Column", "Index"], correctAnswer: "JSON-like data structure", explanation: "Documents are JSON-like BSON objects that store data." },
    { question: "What is a collection?", options: ["Group of documents", "Database", "Table", "Row"], correctAnswer: "Group of documents", explanation: "Collections are groups of MongoDB documents, similar to tables." },
    { question: "What is the purpose of find()?", options: ["Query documents", "Insert documents", "Update documents", "Delete documents"], correctAnswer: "Query documents", explanation: "find() retrieves documents from a collection." },
    { question: "What is the purpose of insertOne()?", options: ["Insert single document", "Insert multiple documents", "Update document", "Delete document"], correctAnswer: "Insert single document", explanation: "insertOne() inserts a single document into a collection." },
    { question: "What is the _id field?", options: ["Unique identifier for documents", "Index", "Collection name", "Database name"], correctAnswer: "Unique identifier for documents", explanation: "_id is a unique identifier automatically added to documents." },
    { question: "What is aggregation in MongoDB?", options: ["Process data and return computed results", "Insert data", "Update data", "Delete data"], correctAnswer: "Process data and return computed results", explanation: "Aggregation processes data records and returns computed results." },
    { question: "What is the purpose of $match stage?", options: ["Filter documents", "Group documents", "Sort documents", "Project fields"], correctAnswer: "Filter documents", explanation: "$match filters documents in the aggregation pipeline." },
    { question: "What is the purpose of $group stage?", options: ["Group documents by field", "Filter documents", "Sort documents", "Project fields"], correctAnswer: "Group documents by field", explanation: "$group groups documents by a specified field." },
    { question: "What is BSON?", options: ["Binary JSON", "Basic JSON", "Better JSON", "Big JSON"], correctAnswer: "Binary JSON", explanation: "BSON is a binary representation of JSON-like documents." }
  ],

  docker: [
    { question: "What is Docker?", options: ["Containerization platform", "Virtual machine", "Operating system", "Programming language"], correctAnswer: "Containerization platform", explanation: "Docker is a platform for developing, shipping, and running applications in containers." },
    { question: "What is a Docker container?", options: ["Lightweight, standalone executable package", "Virtual machine", "Server", "Application"], correctAnswer: "Lightweight, standalone executable package", explanation: "Containers package code and dependencies together." },
    { question: "What is a Docker image?", options: ["Template for creating containers", "Running container", "Virtual machine image", "Backup file"], correctAnswer: "Template for creating containers", explanation: "Images are read-only templates used to create containers." },
    { question: "What is a Dockerfile?", options: ["Script to build Docker images", "Container configuration", "Docker command", "Image file"], correctAnswer: "Script to build Docker images", explanation: "Dockerfile contains instructions for building Docker images." },
    { question: "What is the purpose of docker run?", options: ["Create and start container", "Build image", "Stop container", "Remove container"], correctAnswer: "Create and start container", explanation: "docker run creates and starts a container from an image." },
    { question: "What is Docker Hub?", options: ["Registry for Docker images", "Docker IDE", "Docker server", "Docker tool"], correctAnswer: "Registry for Docker images", explanation: "Docker Hub is a cloud-based registry for Docker images." },
    { question: "What is the purpose of docker-compose?", options: ["Define and run multi-container applications", "Build images", "Run single container", "Remove containers"], correctAnswer: "Define and run multi-container applications", explanation: "docker-compose manages multi-container Docker applications." },
    { question: "What is a Docker volume?", options: ["Persistent data storage", "Container", "Image", "Network"], correctAnswer: "Persistent data storage", explanation: "Volumes provide persistent storage for containers." },
    { question: "What is the purpose of EXPOSE in Dockerfile?", options: ["Document port container listens on", "Open port", "Close port", "Forward port"], correctAnswer: "Document port container listens on", explanation: "EXPOSE documents which ports the container listens on." },
    { question: "What is the purpose of CMD in Dockerfile?", options: ["Default command to run", "Build command", "Copy command", "Install command"], correctAnswer: "Default command to run", explanation: "CMD specifies the default command to run when container starts." }
  ],

  angular: [
    { question: "What is Angular?", options: ["TypeScript-based web framework", "JavaScript library", "Backend framework", "Database"], correctAnswer: "TypeScript-based web framework", explanation: "Angular is a TypeScript-based web application framework." },
    { question: "What is a component in Angular?", options: ["Building block of UI", "Service", "Module", "Directive"], correctAnswer: "Building block of UI", explanation: "Components are the basic building blocks of Angular applications." },
    { question: "What is a module in Angular?", options: ["Container for related code", "Component", "Service", "Directive"], correctAnswer: "Container for related code", explanation: "Modules organize an application into cohesive blocks." },
    { question: "What is a service in Angular?", options: ["Shareable business logic", "Component", "Module", "Directive"], correctAnswer: "Shareable business logic", explanation: "Services provide reusable business logic across components." },
    { question: "What is dependency injection?", options: ["Design pattern for providing dependencies", "Module import", "Component creation", "Service call"], correctAnswer: "Design pattern for providing dependencies", explanation: "DI is a design pattern where dependencies are provided to classes." },
    { question: "What is a directive in Angular?", options: ["Modify DOM behavior or appearance", "Component", "Service", "Module"], correctAnswer: "Modify DOM behavior or appearance", explanation: "Directives add behavior to existing DOM elements." },
    { question: "What is data binding?", options: ["Sync data between component and view", "API call", "Routing", "Module import"], correctAnswer: "Sync data between component and view", explanation: "Data binding synchronizes data between component and template." },
    { question: "What is the purpose of ngOnInit?", options: ["Lifecycle hook for initialization", "Constructor", "Destructor", "Event handler"], correctAnswer: "Lifecycle hook for initialization", explanation: "ngOnInit is called after component initialization." },
    { question: "What is the purpose of *ngIf?", options: ["Conditionally render elements", "Loop elements", "Bind data", "Handle events"], correctAnswer: "Conditionally render elements", explanation: "*ngIf conditionally includes or excludes elements." },
    { question: "What is the purpose of *ngFor?", options: ["Loop through arrays", "Conditional rendering", "Data binding", "Event handling"], correctAnswer: "Loop through arrays", explanation: "*ngFor repeats elements for each item in an array." }
  ],

  vue: [
    { question: "What is Vue.js?", options: ["Progressive JavaScript framework", "Library", "Backend framework", "Database"], correctAnswer: "Progressive JavaScript framework", explanation: "Vue.js is a progressive framework for building user interfaces." },
    { question: "What is a Vue component?", options: ["Reusable Vue instance", "Function", "Module", "Class"], correctAnswer: "Reusable Vue instance", explanation: "Components are reusable Vue instances with a name." },
    { question: "What is the purpose of data() function?", options: ["Define component state", "Handle events", "Compute values", "Watch changes"], correctAnswer: "Define component state", explanation: "data() returns an object containing component's reactive state." },
    { question: "What is v-model?", options: ["Two-way data binding", "One-way binding", "Event binding", "Attribute binding"], correctAnswer: "Two-way data binding", explanation: "v-model creates two-way binding on form inputs." },
    { question: "What is the purpose of v-if?", options: ["Conditional rendering", "Loop rendering", "Event handling", "Data binding"], correctAnswer: "Conditional rendering", explanation: "v-if conditionally renders elements based on expression." },
    { question: "What is the purpose of v-for?", options: ["Render list of items", "Conditional rendering", "Event handling", "Data binding"], correctAnswer: "Render list of items", explanation: "v-for renders a list of items based on an array." },
    { question: "What is the purpose of v-on?", options: ["Attach event listeners", "Bind data", "Conditional rendering", "Loop rendering"], correctAnswer: "Attach event listeners", explanation: "v-on attaches event listeners to elements." },
    { question: "What is a computed property?", options: ["Cached calculated value", "Method", "Watcher", "Data property"], correctAnswer: "Cached calculated value", explanation: "Computed properties are cached based on their dependencies." },
    { question: "What is the purpose of props?", options: ["Pass data to child components", "Emit events", "Store state", "Compute values"], correctAnswer: "Pass data to child components", explanation: "props allow passing data from parent to child components." },
    { question: "What is Vuex?", options: ["State management library", "Router", "HTTP client", "Testing tool"], correctAnswer: "State management library", explanation: "Vuex is a state management pattern and library for Vue." }
  ],

  postgresql: [
    { question: "What is PostgreSQL?", options: ["Open-source relational database", "NoSQL database", "Key-value store", "Graph database"], correctAnswer: "Open-source relational database", explanation: "PostgreSQL is a powerful open-source relational database system." },
    { question: "What is the purpose of SERIAL data type?", options: ["Auto-incrementing integer", "String type", "Date type", "Boolean type"], correctAnswer: "Auto-incrementing integer", explanation: "SERIAL creates an auto-incrementing integer column." },
    { question: "What is a schema in PostgreSQL?", options: ["Namespace for database objects", "Table structure", "Query plan", "Index type"], correctAnswer: "Namespace for database objects", explanation: "Schemas organize database objects into logical groups." },
    { question: "What is the purpose of VACUUM?", options: ["Reclaim storage and optimize performance", "Delete data", "Backup database", "Create index"], correctAnswer: "Reclaim storage and optimize performance", explanation: "VACUUM reclaims storage occupied by dead tuples." },
    { question: "What is a materialized view?", options: ["Cached query result", "Regular view", "Table", "Index"], correctAnswer: "Cached query result", explanation: "Materialized views store query results physically for faster access." },
    { question: "What is the purpose of EXPLAIN?", options: ["Show query execution plan", "Execute query", "Create query", "Delete query"], correctAnswer: "Show query execution plan", explanation: "EXPLAIN displays the execution plan for a query." },
    { question: "What is JSONB data type?", options: ["Binary JSON storage", "Text JSON", "Array type", "Object type"], correctAnswer: "Binary JSON storage", explanation: "JSONB stores JSON data in a binary format for efficient processing." },
    { question: "What is the purpose of pg_dump?", options: ["Backup database", "Restore database", "Query database", "Delete database"], correctAnswer: "Backup database", explanation: "pg_dump creates a backup of a PostgreSQL database." },
    { question: "What is a trigger in PostgreSQL?", options: ["Function executed on table events", "Constraint", "Index", "View"], correctAnswer: "Function executed on table events", explanation: "Triggers automatically execute functions in response to table events." },
    { question: "What is the purpose of COPY command?", options: ["Import/export data from files", "Copy table", "Copy database", "Copy schema"], correctAnswer: "Import/export data from files", explanation: "COPY efficiently imports or exports data between files and tables." }
  ],

  kubernetes: [
    { question: "What is Kubernetes?", options: ["Container orchestration platform", "Container runtime", "Virtual machine", "Operating system"], correctAnswer: "Container orchestration platform", explanation: "Kubernetes orchestrates and manages containerized applications." },
    { question: "What is a Pod?", options: ["Smallest deployable unit", "Container", "Node", "Cluster"], correctAnswer: "Smallest deployable unit", explanation: "Pods are the smallest deployable units that can contain one or more containers." },
    { question: "What is a Node?", options: ["Worker machine in cluster", "Pod", "Container", "Service"], correctAnswer: "Worker machine in cluster", explanation: "Nodes are worker machines that run containerized applications." },
    { question: "What is a Service?", options: ["Expose pods to network", "Pod group", "Container", "Volume"], correctAnswer: "Expose pods to network", explanation: "Services provide stable network endpoints for accessing pods." },
    { question: "What is a Deployment?", options: ["Manages replica sets and pods", "Single pod", "Service", "Volume"], correctAnswer: "Manages replica sets and pods", explanation: "Deployments manage the desired state of replica sets and pods." },
    { question: "What is kubectl?", options: ["Command-line tool for Kubernetes", "Container runtime", "Pod manager", "Service mesh"], correctAnswer: "Command-line tool for Kubernetes", explanation: "kubectl is the CLI tool for interacting with Kubernetes clusters." },
    { question: "What is a Namespace?", options: ["Virtual cluster for resource isolation", "Pod group", "Node group", "Service type"], correctAnswer: "Virtual cluster for resource isolation", explanation: "Namespaces provide virtual clusters for organizing resources." },
    { question: "What is a ConfigMap?", options: ["Store configuration data", "Secret storage", "Volume type", "Service type"], correctAnswer: "Store configuration data", explanation: "ConfigMaps store non-sensitive configuration data as key-value pairs." },
    { question: "What is a Secret?", options: ["Store sensitive data", "ConfigMap", "Volume", "Service"], correctAnswer: "Store sensitive data", explanation: "Secrets store sensitive information like passwords and tokens." },
    { question: "What is an Ingress?", options: ["Manage external access to services", "Internal service", "Pod network", "Volume mount"], correctAnswer: "Manage external access to services", explanation: "Ingress manages external HTTP/HTTPS access to services." }
  ],

  aws: [
    { question: "What does AWS stand for?", options: ["Amazon Web Services", "Amazon Web System", "Amazon World Services", "Amazon Wide Services"], correctAnswer: "Amazon Web Services", explanation: "AWS stands for Amazon Web Services." },
    { question: "What is EC2?", options: ["Virtual server in cloud", "Storage service", "Database service", "CDN service"], correctAnswer: "Virtual server in cloud", explanation: "EC2 (Elastic Compute Cloud) provides resizable virtual servers." },
    { question: "What is S3?", options: ["Object storage service", "Block storage", "File storage", "Database storage"], correctAnswer: "Object storage service", explanation: "S3 (Simple Storage Service) provides scalable object storage." },
    { question: "What is Lambda?", options: ["Serverless compute service", "Virtual machine", "Container service", "Database service"], correctAnswer: "Serverless compute service", explanation: "Lambda runs code without provisioning servers." },
    { question: "What is RDS?", options: ["Managed relational database", "NoSQL database", "Object storage", "Cache service"], correctAnswer: "Managed relational database", explanation: "RDS (Relational Database Service) manages relational databases." },
    { question: "What is VPC?", options: ["Virtual private cloud network", "Virtual machine", "Storage service", "Database service"], correctAnswer: "Virtual private cloud network", explanation: "VPC (Virtual Private Cloud) provides isolated network environments." },
    { question: "What is IAM?", options: ["Identity and access management", "Instance manager", "Image manager", "Integration manager"], correctAnswer: "Identity and access management", explanation: "IAM manages user access and permissions to AWS resources." },
    { question: "What is CloudFront?", options: ["Content delivery network", "Cloud storage", "Virtual machine", "Database service"], correctAnswer: "Content delivery network", explanation: "CloudFront is a CDN that delivers content with low latency." },
    { question: "What is ECS?", options: ["Container orchestration service", "Virtual machine service", "Storage service", "Database service"], correctAnswer: "Container orchestration service", explanation: "ECS (Elastic Container Service) runs and manages Docker containers." },
    { question: "What is DynamoDB?", options: ["NoSQL database service", "Relational database", "Object storage", "Cache service"], correctAnswer: "NoSQL database service", explanation: "DynamoDB is a fully managed NoSQL database service." }
  ],

  pandas: [
    { question: "What is pandas?", options: ["Python data analysis library", "Machine learning library", "Web framework", "Database"], correctAnswer: "Python data analysis library", explanation: "pandas is a powerful data manipulation and analysis library for Python." },
    { question: "What is a DataFrame?", options: ["2D labeled data structure", "1D array", "Dictionary", "List"], correctAnswer: "2D labeled data structure", explanation: "DataFrame is a 2-dimensional labeled data structure with columns of potentially different types." },
    { question: "What is a Series?", options: ["1D labeled array", "2D array", "Dictionary", "Tuple"], correctAnswer: "1D labeled array", explanation: "Series is a one-dimensional labeled array capable of holding any data type." },
    { question: "How do you read a CSV file in pandas?", options: ["pd.read_csv()", "pd.load_csv()", "pd.import_csv()", "pd.open_csv()"], correctAnswer: "pd.read_csv()", explanation: "pd.read_csv() reads a CSV file into a DataFrame." },
    { question: "What does df.head() do?", options: ["Returns first 5 rows", "Returns last 5 rows", "Returns column names", "Returns data types"], correctAnswer: "Returns first 5 rows", explanation: "head() returns the first n rows (default 5) of a DataFrame." },
    { question: "What does df.tail() do?", options: ["Returns last 5 rows", "Returns first 5 rows", "Returns column names", "Returns data types"], correctAnswer: "Returns last 5 rows", explanation: "tail() returns the last n rows (default 5) of a DataFrame." },
    { question: "What does df.info() provide?", options: ["Summary of DataFrame structure", "Statistical summary", "First rows", "Last rows"], correctAnswer: "Summary of DataFrame structure", explanation: "info() provides a concise summary including data types and non-null counts." },
    { question: "What does df.describe() do?", options: ["Statistical summary of numeric columns", "Data types", "Column names", "Row count"], correctAnswer: "Statistical summary of numeric columns", explanation: "describe() generates descriptive statistics like mean, std, min, max." },
    { question: "How do you select a column in pandas?", options: ["df['column_name'] or df.column_name", "df.select('column')", "df.get('column')", "df.column('name')"], correctAnswer: "df['column_name'] or df.column_name", explanation: "Columns can be accessed using bracket notation or dot notation." },
    { question: "What is loc used for?", options: ["Label-based indexing", "Position-based indexing", "Boolean indexing", "Random selection"], correctAnswer: "Label-based indexing", explanation: "loc is used for label-based indexing to access rows and columns by labels." },
    { question: "What is iloc used for?", options: ["Position-based indexing", "Label-based indexing", "Boolean indexing", "Random selection"], correctAnswer: "Position-based indexing", explanation: "iloc is used for integer position-based indexing." },
    { question: "How do you handle missing values with dropna()?", options: ["Remove rows/columns with NaN", "Fill NaN with values", "Count NaN values", "Replace NaN"], correctAnswer: "Remove rows/columns with NaN", explanation: "dropna() removes missing values from DataFrame." },
    { question: "What does fillna() do?", options: ["Fill missing values", "Remove missing values", "Count missing values", "Find missing values"], correctAnswer: "Fill missing values", explanation: "fillna() fills NA/NaN values with specified values or methods." },
    { question: "What does groupby() do?", options: ["Group data for aggregation", "Sort data", "Filter data", "Merge data"], correctAnswer: "Group data for aggregation", explanation: "groupby() groups data by one or more columns for aggregation operations." },
    { question: "What does merge() do?", options: ["Combine DataFrames like SQL join", "Sort DataFrame", "Filter DataFrame", "Group DataFrame"], correctAnswer: "Combine DataFrames like SQL join", explanation: "merge() combines DataFrames using database-style joins." },
    { question: "What does concat() do?", options: ["Concatenate DataFrames along axis", "Merge DataFrames", "Split DataFrame", "Filter DataFrame"], correctAnswer: "Concatenate DataFrames along axis", explanation: "concat() concatenates pandas objects along a particular axis." },
    { question: "What does pivot_table() do?", options: ["Create spreadsheet-style pivot table", "Sort data", "Filter data", "Merge data"], correctAnswer: "Create spreadsheet-style pivot table", explanation: "pivot_table() creates a spreadsheet-style pivot table as a DataFrame." },
    { question: "What does apply() do?", options: ["Apply function along axis", "Filter data", "Sort data", "Merge data"], correctAnswer: "Apply function along axis", explanation: "apply() applies a function along an axis of the DataFrame." },
    { question: "What does value_counts() do?", options: ["Count unique values", "Sum values", "Mean values", "Sort values"], correctAnswer: "Count unique values", explanation: "value_counts() returns a Series containing counts of unique values." },
    { question: "How do you sort a DataFrame?", options: ["df.sort_values()", "df.sort()", "df.order()", "df.arrange()"], correctAnswer: "df.sort_values()", explanation: "sort_values() sorts DataFrame by values along either axis." },
    { question: "What does df.isnull() do?", options: ["Detect missing values", "Remove missing values", "Fill missing values", "Count values"], correctAnswer: "Detect missing values", explanation: "isnull() detects missing values and returns boolean mask." },
    { question: "What does df.drop() do?", options: ["Remove rows or columns", "Add rows or columns", "Rename columns", "Sort data"], correctAnswer: "Remove rows or columns", explanation: "drop() removes specified labels from rows or columns." },
    { question: "What does df.rename() do?", options: ["Rename columns or index", "Remove columns", "Add columns", "Sort columns"], correctAnswer: "Rename columns or index", explanation: "rename() alters axis labels (column names or index)." },
    { question: "What is the purpose of df.reset_index()?", options: ["Reset index to default integer index", "Set new index", "Remove index", "Sort index"], correctAnswer: "Reset index to default integer index", explanation: "reset_index() resets the index to default integer index." },
    { question: "What does df.set_index() do?", options: ["Set DataFrame index using column", "Reset index", "Remove index", "Sort index"], correctAnswer: "Set DataFrame index using column", explanation: "set_index() sets the DataFrame index using existing columns." }
  ],

  numpy: [
    { question: "What is NumPy?", options: ["Numerical computing library for Python", "Data analysis library", "Web framework", "Database"], correctAnswer: "Numerical computing library for Python", explanation: "NumPy is the fundamental package for scientific computing in Python." },
    { question: "What is a NumPy array?", options: ["Multidimensional array object", "List", "Dictionary", "Tuple"], correctAnswer: "Multidimensional array object", explanation: "NumPy arrays are efficient multidimensional array objects." },
    { question: "How do you create a NumPy array?", options: ["np.array()", "np.create()", "np.make()", "np.new()"], correctAnswer: "np.array()", explanation: "np.array() creates a NumPy array from a Python list or tuple." },
    { question: "What does np.zeros() do?", options: ["Create array filled with zeros", "Create array filled with ones", "Create empty array", "Create random array"], correctAnswer: "Create array filled with zeros", explanation: "np.zeros() creates a new array filled with zeros." },
    { question: "What does np.ones() do?", options: ["Create array filled with ones", "Create array filled with zeros", "Create empty array", "Create random array"], correctAnswer: "Create array filled with ones", explanation: "np.ones() creates a new array filled with ones." },
    { question: "What does np.arange() do?", options: ["Create array with evenly spaced values", "Create random array", "Create zeros array", "Create ones array"], correctAnswer: "Create array with evenly spaced values", explanation: "np.arange() returns evenly spaced values within a given interval." },
    { question: "What does np.linspace() do?", options: ["Create array with specified number of elements", "Create random array", "Create zeros array", "Create ones array"], correctAnswer: "Create array with specified number of elements", explanation: "np.linspace() returns evenly spaced numbers over a specified interval." },
    { question: "What is array shape?", options: ["Dimensions of array", "Array size", "Array type", "Array values"], correctAnswer: "Dimensions of array", explanation: "Shape is a tuple representing the dimensions of the array." },
    { question: "What does reshape() do?", options: ["Change array shape without changing data", "Change array values", "Change array type", "Change array size"], correctAnswer: "Change array shape without changing data", explanation: "reshape() gives a new shape to an array without changing its data." },
    { question: "What does np.transpose() do?", options: ["Permute array dimensions", "Reverse array", "Sort array", "Filter array"], correctAnswer: "Permute array dimensions", explanation: "transpose() permutes the dimensions of an array." },
    { question: "What is broadcasting in NumPy?", options: ["Operate on arrays of different shapes", "Create arrays", "Delete arrays", "Copy arrays"], correctAnswer: "Operate on arrays of different shapes", explanation: "Broadcasting allows NumPy to work with arrays of different shapes during arithmetic operations." },
    { question: "What does np.dot() do?", options: ["Compute dot product", "Element-wise multiplication", "Matrix addition", "Matrix subtraction"], correctAnswer: "Compute dot product", explanation: "np.dot() computes the dot product of two arrays." },
    { question: "What does np.sum() do?", options: ["Sum array elements", "Multiply elements", "Find maximum", "Find minimum"], correctAnswer: "Sum array elements", explanation: "np.sum() computes the sum of array elements over a given axis." },
    { question: "What does np.mean() do?", options: ["Compute arithmetic mean", "Compute median", "Compute mode", "Compute sum"], correctAnswer: "Compute arithmetic mean", explanation: "np.mean() computes the arithmetic mean along the specified axis." },
    { question: "What does np.max() do?", options: ["Find maximum value", "Find minimum value", "Find mean value", "Find sum"], correctAnswer: "Find maximum value", explanation: "np.max() returns the maximum value along an axis." },
    { question: "What does np.min() do?", options: ["Find minimum value", "Find maximum value", "Find mean value", "Find sum"], correctAnswer: "Find minimum value", explanation: "np.min() returns the minimum value along an axis." },
    { question: "What does np.std() do?", options: ["Compute standard deviation", "Compute mean", "Compute variance", "Compute median"], correctAnswer: "Compute standard deviation", explanation: "np.std() computes the standard deviation along the specified axis." },
    { question: "What does np.random.rand() do?", options: ["Generate random values in [0, 1)", "Generate random integers", "Generate normal distribution", "Generate zeros"], correctAnswer: "Generate random values in [0, 1)", explanation: "np.random.rand() creates an array of random values from uniform distribution over [0, 1)." },
    { question: "What does np.random.randn() do?", options: ["Generate random values from standard normal distribution", "Generate uniform random values", "Generate random integers", "Generate zeros"], correctAnswer: "Generate random values from standard normal distribution", explanation: "np.random.randn() returns samples from the standard normal distribution." },
    { question: "What does np.concatenate() do?", options: ["Join arrays along existing axis", "Split arrays", "Create arrays", "Delete arrays"], correctAnswer: "Join arrays along existing axis", explanation: "np.concatenate() joins a sequence of arrays along an existing axis." },
    { question: "What does np.vstack() do?", options: ["Stack arrays vertically", "Stack arrays horizontally", "Split arrays", "Reshape arrays"], correctAnswer: "Stack arrays vertically", explanation: "np.vstack() stacks arrays in sequence vertically (row-wise)." },
    { question: "What does np.hstack() do?", options: ["Stack arrays horizontally", "Stack arrays vertically", "Split arrays", "Reshape arrays"], correctAnswer: "Stack arrays horizontally", explanation: "np.hstack() stacks arrays in sequence horizontally (column-wise)." },
    { question: "What is the difference between np.array and np.matrix?", options: ["array is general, matrix is 2D only", "No difference", "matrix is general", "array is 2D only"], correctAnswer: "array is general, matrix is 2D only", explanation: "np.array is the standard, np.matrix is always 2D and is deprecated." },
    { question: "What does np.where() do?", options: ["Return elements based on condition", "Find index", "Sort array", "Filter array"], correctAnswer: "Return elements based on condition", explanation: "np.where() returns elements chosen from x or y depending on condition." },
    { question: "What does np.argmax() do?", options: ["Return index of maximum value", "Return maximum value", "Return index of minimum", "Return minimum value"], correctAnswer: "Return index of maximum value", explanation: "np.argmax() returns the indices of the maximum values along an axis." }
  ],

  productivity: [
    { question: "What is the Pomodoro Technique?", options: ["25-minute focused work sessions with breaks", "8-hour work day", "Multitasking method", "Email management system"], correctAnswer: "25-minute focused work sessions with breaks", explanation: "The Pomodoro Technique uses 25-minute focused work intervals followed by short breaks." },
    { question: "What does GTD stand for?", options: ["Getting Things Done", "Go To Do", "Great Task Design", "Goal Tracking Daily"], correctAnswer: "Getting Things Done", explanation: "GTD (Getting Things Done) is a productivity methodology by David Allen." },
    { question: "What is the Eisenhower Matrix used for?", options: ["Prioritizing tasks by urgency and importance", "Time tracking", "Goal setting", "Email management"], correctAnswer: "Prioritizing tasks by urgency and importance", explanation: "The Eisenhower Matrix categorizes tasks into four quadrants based on urgency and importance." },
    { question: "What is the 2-Minute Rule?", options: ["If task takes less than 2 minutes, do it now", "Take 2-minute breaks", "Plan for 2 minutes daily", "Work in 2-minute intervals"], correctAnswer: "If task takes less than 2 minutes, do it now", explanation: "The 2-Minute Rule states that if a task takes less than 2 minutes, do it immediately." },
    { question: "What is time blocking?", options: ["Scheduling specific time slots for tasks", "Blocking distractions", "Working in blocks of hours", "Blocking social media"], correctAnswer: "Scheduling specific time slots for tasks", explanation: "Time blocking involves scheduling specific time periods for different tasks or activities." },
    { question: "What is the 80/20 rule (Pareto Principle)?", options: ["80% of results come from 20% of efforts", "Work 80%, rest 20%", "80% planning, 20% execution", "80 minutes work, 20 minutes break"], correctAnswer: "80% of results come from 20% of efforts", explanation: "The Pareto Principle states that 80% of outcomes come from 20% of inputs." },
    { question: "What is deep work?", options: ["Focused work without distractions", "Working late at night", "Physical labor", "Team collaboration"], correctAnswer: "Focused work without distractions", explanation: "Deep work is the ability to focus without distraction on cognitively demanding tasks." },
    { question: "What is batch processing in productivity?", options: ["Grouping similar tasks together", "Processing emails in batches", "Working in batches of time", "Batch cooking meals"], correctAnswer: "Grouping similar tasks together", explanation: "Batch processing involves grouping similar tasks and completing them in one session." },
    { question: "What is the purpose of a morning routine?", options: ["Start day with consistent productive habits", "Wake up early", "Exercise only", "Plan the day"], correctAnswer: "Start day with consistent productive habits", explanation: "A morning routine establishes consistent habits that set a productive tone for the day." },
    { question: "What is decision fatigue?", options: ["Mental exhaustion from making too many decisions", "Physical tiredness", "Lack of sleep", "Information overload"], correctAnswer: "Mental exhaustion from making too many decisions", explanation: "Decision fatigue is the deteriorating quality of decisions after making many decisions." },
    { question: "What is the purpose of a weekly review?", options: ["Reflect on progress and plan ahead", "Review emails", "Check calendar", "Count completed tasks"], correctAnswer: "Reflect on progress and plan ahead", explanation: "Weekly reviews help reflect on accomplishments and plan for the upcoming week." },
    { question: "What is inbox zero?", options: ["Keeping email inbox empty or organized", "Zero emails sent", "No notifications", "Deleting all emails"], correctAnswer: "Keeping email inbox empty or organized", explanation: "Inbox Zero is a method to keep your email inbox empty or minimal through regular processing." },
    { question: "What is the purpose of saying 'no'?", options: ["Protect time for important priorities", "Avoid all commitments", "Be antisocial", "Reduce workload only"], correctAnswer: "Protect time for important priorities", explanation: "Saying no helps protect your time and energy for truly important priorities." },
    { question: "What is a productivity system?", options: ["Framework for organizing and completing tasks", "Software tool", "Time tracker", "Calendar app"], correctAnswer: "Framework for organizing and completing tasks", explanation: "A productivity system is a structured approach to organizing, prioritizing, and completing work." },
    { question: "What is the purpose of single-tasking?", options: ["Focus on one task at a time for better quality", "Work faster", "Avoid multitasking apps", "Complete one task per day"], correctAnswer: "Focus on one task at a time for better quality", explanation: "Single-tasking improves focus, quality, and efficiency by concentrating on one task at a time." },
    { question: "What is a SMART goal?", options: ["Specific, Measurable, Achievable, Relevant, Time-bound", "Simple, Manageable, Actionable, Realistic, Timely", "Strategic, Meaningful, Ambitious, Rewarding, Trackable", "Short, Memorable, Achievable, Relevant, Testable"], correctAnswer: "Specific, Measurable, Achievable, Relevant, Time-bound", explanation: "SMART goals are Specific, Measurable, Achievable, Relevant, and Time-bound." },
    { question: "What is context switching?", options: ["Shifting between different tasks or projects", "Changing work environment", "Switching devices", "Changing priorities"], correctAnswer: "Shifting between different tasks or projects", explanation: "Context switching is the mental cost of shifting attention between different tasks." },
    { question: "What is the purpose of a distraction-free environment?", options: ["Maintain focus and concentration", "Avoid people", "Work in silence", "Use minimal tools"], correctAnswer: "Maintain focus and concentration", explanation: "A distraction-free environment helps maintain deep focus and improves productivity." },
    { question: "What is energy management?", options: ["Aligning tasks with energy levels throughout day", "Managing electricity", "Physical fitness", "Sleep schedule"], correctAnswer: "Aligning tasks with energy levels throughout day", explanation: "Energy management involves scheduling tasks based on your natural energy rhythms." },
    { question: "What is the purpose of automation in productivity?", options: ["Eliminate repetitive tasks to save time", "Use robots", "Automate everything", "Reduce human work"], correctAnswer: "Eliminate repetitive tasks to save time", explanation: "Automation eliminates repetitive tasks, freeing time for high-value work." },
    { question: "What is a habit stack?", options: ["Linking new habits to existing ones", "Multiple habits at once", "Daily habit list", "Habit tracking app"], correctAnswer: "Linking new habits to existing ones", explanation: "Habit stacking involves attaching new habits to existing routines for easier adoption." },
    { question: "What is the purpose of breaks in productivity?", options: ["Restore mental energy and prevent burnout", "Waste time", "Socialize only", "Check social media"], correctAnswer: "Restore mental energy and prevent burnout", explanation: "Regular breaks restore mental energy, improve focus, and prevent burnout." },
    { question: "What is the MIT (Most Important Task) method?", options: ["Identify and complete top priority task first", "Massachusetts Institute of Technology method", "Multiple Important Tasks", "Morning Important Time"], correctAnswer: "Identify and complete top priority task first", explanation: "MIT method involves identifying and completing your most important task first thing." },
    { question: "What is procrastination?", options: ["Delaying tasks despite negative consequences", "Taking breaks", "Planning too much", "Working slowly"], correctAnswer: "Delaying tasks despite negative consequences", explanation: "Procrastination is voluntarily delaying tasks despite knowing it may have negative consequences." },
    { question: "What is the purpose of a productivity journal?", options: ["Track progress and identify patterns", "Write daily tasks", "Keep diary", "Log work hours"], correctAnswer: "Track progress and identify patterns", explanation: "A productivity journal helps track progress, reflect on habits, and identify improvement areas." }
  ]
};

// Language keyword mappings for better matching
export const languageKeywords = {
  // Programming Languages
  java: ['java', 'jvm', 'spring', 'maven', 'gradle'],
  cpp: ['c++', 'cpp', 'cplusplus'],
  javascript: ['javascript', 'js', 'ecmascript', 'es6', 'es2015'],
  nodejs: ['node', 'nodejs', 'node.js', 'npm', 'express'],
  python: ['python', 'py', 'python3', 'pip'],
  typescript: ['typescript', 'ts'],
  go: ['go', 'golang'],
  rust: ['rust', 'cargo'],
  php: ['php'],
  ruby: ['ruby', 'rb', 'rails'],
  swift: ['swift', 'ios', 'macos'],
  kotlin: ['kotlin', 'android'],
  csharp: ['c#', 'csharp', 'dotnet', '.net'],
  
  // Frameworks & Libraries
  express: ['express', 'expressjs', 'express.js'],
  react: ['react', 'reactjs', 'react.js'],
  nextjs: ['next', 'nextjs', 'next.js'],
  angular: ['angular', 'angularjs'],
  vue: ['vue', 'vuejs', 'vue.js'],
  
  // Data Science & ML Libraries
  pandas: ['pandas', 'pd', 'dataframe', 'series'],
  numpy: ['numpy', 'np', 'array', 'ndarray'],
  
  // Productivity & Personal Development
  productivity: ['productivity', 'time management', 'gtd', 'pomodoro', 'habits', 'efficiency', 'focus'],
  
  // Databases
  sql: ['sql', 'mysql', 'mariadb'],
  postgresql: ['postgresql', 'postgres', 'psql'],
  mongodb: ['mongodb', 'mongo', 'nosql'],
  
  // DevOps & Cloud
  docker: ['docker', 'container', 'dockerfile'],
  kubernetes: ['kubernetes', 'k8s', 'kubectl'],
  aws: ['aws', 'amazon web services', 'ec2', 's3', 'lambda']
};
