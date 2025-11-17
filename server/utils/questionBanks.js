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
    }
  ]
};
