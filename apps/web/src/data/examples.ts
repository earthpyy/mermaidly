export const EXAMPLES: Record<string, string> = {
  flow: `flowchart LR
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Ship it 🚀]
    B -->|No| D[Debug]
    D --> B
    C --> E[Celebrate]`,
  seq: `sequenceDiagram
    participant U as User
    participant A as App
    participant S as Server
    U->>A: Click "Save"
    A->>S: POST /save
    S-->>A: 200 OK
    A-->>U: Saved!`,
  class: `classDiagram
    class Animal {
      +String name
      +int age
      +makeSound()
    }
    class Dog {
      +String breed
      +bark()
    }
    class Cat {
      +bool indoor
      +purr()
    }
    Animal <|-- Dog
    Animal <|-- Cat`,
  state: `stateDiagram-v2
    [*] --> Idle
    Idle --> Loading: fetch
    Loading --> Success: 200
    Loading --> Error: 4xx/5xx
    Success --> Idle: reset
    Error --> Idle: retry
    Success --> [*]`,
  er: `erDiagram
    CUSTOMER ||--o{ ORDER : places
    ORDER ||--|{ LINE-ITEM : contains
    CUSTOMER }|..|{ DELIVERY-ADDRESS : uses
    PRODUCT ||--o{ LINE-ITEM : "ordered in"`,
  gantt: `gantt
    title Project Timeline
    dateFormat YYYY-MM-DD
    section Design
    Research      :done,    a1, 2026-01-01, 7d
    Wireframes    :active,  a2, after a1, 5d
    section Build
    Frontend      :         b1, after a2, 14d
    Backend       :         b2, after a2, 10d`,
  pie: `pie title Daily Time Allocation
    "Coding" : 45
    "Meetings" : 20
    "Email" : 10
    "Coffee breaks" : 15
    "Actually thinking" : 10`,
  mind: `mindmap
  root((mermaidly))
    Diagrams
      Flowchart
      Sequence
      Gantt
    Features
      Auto-render
      Dark mode
      Share link
    Export
      PNG
      SVG`,
}
