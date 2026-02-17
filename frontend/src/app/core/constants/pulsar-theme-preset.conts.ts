import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

const primaryColorScheme = {
  light: {
    background: '{surface.0}',
    borderColor: '{violet.200}',
  },
  dark: {
    background: '{slate.950}',
    borderColor: '{slate.700}',
  },
};

export const pulsarThemePreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{violet.50}',
      100: '{violet.100}',
      200: '{violet.200}',
      300: '{violet.300}',
      400: '{violet.400}',
      500: '{violet.500}',
      600: '{violet.600}',
      700: '{violet.700}',
      800: '{violet.800}',
      900: '{violet.900}',
      950: '{violet.950}',
    },
    colorScheme: {
      light: {
        formField: {
          hoverBorderColor: '{primary.color}',
          focusBorderColor: '{primary.color}',
        },
        highlight: {
          background: '{primary.50}',
          focusBackground: '{primary.100}',
          color: '{primary.700}',
          focusColor: '{primary.800}',
        },
      },
      dark: {
        formField: {
          hoverBorderColor: '{primary.color}',
          focusBorderColor: '{primary.color}',
        },
        highlight: {
          background: '{primary.900}',
          focusBackground: '{primary.800}',
          color: '{primary.200}',
          focusColor: '{primary.100}',
        },
      },
    },
  },
  components: {
    menu: {
      colorScheme: {
        light: {
          root: { ...primaryColorScheme.light, borderColor: '{surface.0}' },
        },
        dark: {
          root: { ...primaryColorScheme.dark, borderColor: '{slate.950}' },
        },
      },
    },
    card: {
      colorScheme: {
        light: {
          root: { background: '{surface.0}', shadow: 'none' },
        },
        dark: {
          root: { background: '{slate.950}', shadow: 'none' },
        },
      },
    },
    drawer: {
      colorScheme: {
        light: {
          root: primaryColorScheme.light,
        },
        dark: {
          root: primaryColorScheme.dark,
        },
      },
      header: {
        padding: '1rem',
      },
      content: {
        padding: '1rem',
      },
    },
    dialog: {
      root: {
        borderRadius: '0.75rem',
        shadow:
          '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
      },
      content: {
        padding: '2rem',
      },
      colorScheme: {
        light: {
          root: primaryColorScheme.light,
        },
        dark: {
          root: primaryColorScheme.dark,
        },
      },
    },
    textarea: {
      colorScheme: {
        light: {
          root: primaryColorScheme.light,
        },
        dark: {
          root: primaryColorScheme.dark,
        },
      },
    },
    inputtext: {
      colorScheme: {
        light: {
          root: primaryColorScheme.light,
        },
        dark: {
          root: primaryColorScheme.dark,
        },
      },
    },
    datepicker: {
      colorScheme: {
        light: {
          header: primaryColorScheme.light,
          panel: primaryColorScheme.light,
          dropdown: primaryColorScheme.light,
        },
        dark: {
          header: primaryColorScheme.dark,
          panel: primaryColorScheme.dark,
          dropdown: primaryColorScheme.dark,
        },
      },
    },
    datatable: {
      colorScheme: {
        light: {
          headerCell: primaryColorScheme.light,
          row: primaryColorScheme.light,
          bodyCell: primaryColorScheme.light,
        },
        dark: {
          headerCell: primaryColorScheme.dark,
          row: primaryColorScheme.dark,
          bodyCell: primaryColorScheme.dark,
        },
      },
    },
    paginator: {
      colorScheme: {
        light: {
          root: primaryColorScheme.light,
        },
        dark: {
          root: primaryColorScheme.dark,
        },
      },
    },
  },
});
