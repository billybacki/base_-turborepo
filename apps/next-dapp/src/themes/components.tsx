import { CommonColors, Components, Theme } from '@mui/material'

const buildVar = function (name: string) {
  const NAMESPACE = '--ps-'
  return `${NAMESPACE}${name}`
}

export function getDefaultComponents(
  bodyColor: string,
  fontFamily: string
): Components<Omit<Theme, 'components'>> | undefined {
  return {
    MuiCssBaseline: {
      styleOverrides: (theme: Theme) => {
        const common = theme.palette.common
        const vars = Object.keys(common).reduce((prev: any, next) => {
          prev[buildVar(next)] = common[next as unknown as keyof CommonColors]
          return prev
        }, {})

        return {
          html: {
            ...vars,
            '*: hover': {
              transition: '0.2s'
            }
          },
          body: {
            fontFamily: fontFamily,
            fontSize: 14,
            color: bodyColor
          },
          a: {
            textDecoration: 'none',
            color: 'inherit'
          },
          picture: { display: 'inline-flex' },
          input: {
            '&::placeholder': {},
            '&:-webkit-autofill, &:-webkit-autofill:focus': {
              transition: 'background-color 600000s 0s, color 600000s 0s'
            }
          }
        }
      }
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          height: 54,
          'fieldset legend': {
            display: 'none!important'
          },
          '&.Mui-focused': {
            fieldset: {
              borderColor: 'currentColor!important',
              borderWidth: '1px!important'
            }
          }
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8
        }
      }
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {}
      }
    },
    MuiInputAdornment: {
      styleOverrides: {
        root: {
          '&:not(.MuiInputAdornment-hiddenLabel)': {
            marginTop: '0 !important'
          }
        }
      }
    },
    MuiAutocomplete: {
      styleOverrides: {
        root: {
          '& input': {
            paddingTop: '14px !important'
          }
        },
        popper: {
          paddingTop: 8,
          paddingBottom: 8
        },
        paper: {
          borderRadius: 8,
          boxShadow: 'none'
        },

        option: {
          height: 50
        },
        listbox: {
          '&::-webkit-scrollbar': {
            width: 6
          },
          '&::-webkit-scrollbar-thumb': {
            borderRadius: 4
          }
        }
      }
    },
    MuiContainer: {
      defaultProps: {
        maxWidth: 'xl',
        disableGutters: true
      }
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          '.MuiFormLabel-root + div': {
            'textarea.MuiOutlinedInput-input': {
              paddingTop: '0px!important'
            },
            '.MuiOutlinedInput-input': {
              paddingTop: '18px!important',
              paddingBottom: '0px!important'
            }
          }
        }
      }
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          '& .MuiInputBase-root': {
            marginTop: 0
          }
        }
      }
    },
    MuiButton: {
      defaultProps: {
        disableRipple: true
      },
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontSize: 14,
          fontFamily,
          lineHeight: '20px',
          transition:
            'background-color 400ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms'
        },
        sizeLarge: {
          height: 72,
          borderRadius: 8
        },
        sizeMedium: {
          height: 60,
          borderRadius: 8
        },
        sizeSmall: {
          height: 36,
          borderRadius: 8
        },
        textPrimary: {},
        containedPrimary: {
          boxShadow: 'none'
        },
        outlinedPrimary: {},
        containedSecondary: {
          boxShadow: 'none'
        },
        outlinedSecondary: {}
      }
    },
    MuiSelect: {
      defaultProps: {
        MenuProps: {
          PaperProps: {
            sx: {
              marginTop: 16,
              borderRadius: 20,
              maxHeight: 350,
              boxShadow: 'none',
              '& .MuiMenu-list .MuiListSubheader-sticky': {
                fontSize: 12,
                lineHeight: 20 / 12,
                marginTop: 10,
                marginBottom: 10
              }
            }
          },
          MenuListProps: {
            sx: {
              padding: '6px !important'
            }
          }
        }
      },
      styleOverrides: {
        root: {
          borderRadius: 8,
          border: 0,
          '&:before': {
            border: 0
          },
          '&:after': {
            border: 0
          }
        },
        select: {
          '&:focus': {
            background: 'none'
          }
        },
        icon: {
          right: 14
        }
      }
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          borderRadius: 5
        }
      }
    },
    MuiPagination: {
      styleOverrides: {
        root: {
          '& .MuiPagination-ul': {
            // alignItems: 'baseline'
          },

          '& .MuiPaginationItem-root': {
            height: 32,
            borderRadius: 6,
            width: 32,
            margin: '0 12px'
          }
        }
      }
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          fontFamily
        }
      }
    }
  }
}
