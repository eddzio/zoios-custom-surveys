# Custom Surveys Prototype

A Next.js prototype implementation of a survey question editor interface, based on Figma designs.

## Features

- **Step Navigation**: Multi-step wizard interface with progress indicators
- **Question List Sidebar**: Scrollable list of survey questions with selection
- **Question Detail Panel**: Detailed editor for question properties
  - Question type selector (Text, Scale, Yes-no, Multiple-choice)
  - Required toggle
  - Copy and delete actions
  - Question and description fields

## Design System

The project uses a custom design system with:
- CSS variables for colors that support light/dark modes
- Custom typography scales
- Consistent spacing and border radius
- Tailwind CSS for utility classes

## Getting Started

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
custom-surveys-proto/
├── app/
│   ├── components/
│   │   ├── StepNavigation.tsx      # Step progress indicator
│   │   ├── QuestionListSidebar.tsx # Question list component
│   │   └── QuestionDetailPanel.tsx # Question editor panel
│   ├── globals.css                  # Global styles and design tokens
│   ├── layout.tsx                   # Root layout
│   └── page.tsx                     # Main page
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## Components

### StepNavigation

Displays a multi-step progress indicator with navigation buttons.

### QuestionListSidebar

Shows a scrollable list of questions with:
- Question numbers and text
- Selection highlighting
- "Add question" button

### QuestionDetailPanel

Full question editor with:
- Question type selection
- Required toggle
- Copy/delete actions
- Text input fields

## Design Tokens

The design system uses CSS variables defined in `globals.css`:

- `--label-primary`: Primary text color
- `--label-secondary`: Secondary text color
- `--label-light`: Light text color
- `--border`: Border color
- `--control-primary`: Primary control color
- `--background`: Background color

## Technologies

- Next.js 15
- React 18
- TypeScript
- Tailwind CSS
