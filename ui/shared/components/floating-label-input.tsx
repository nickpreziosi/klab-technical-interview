"use client"

import * as React from "react"
import { cn } from "../utils/utils"
import { Input } from "./input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select"
import { Combobox } from "./combobox"
import { NativeSelect } from "./native-select"
import {
  MultipleSelector,
  type MultipleSelectorOption,
} from "./multiple-selector"
import { RadioGroup, RadioGroupItem } from "./radio-group"
import { Label } from "./label"
import { Eye, EyeOff, Search, X } from "lucide-react"
import { Button } from "./button"

export interface FloatingLabelInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  label: string
  labelClassName?: string
  labelStyle?: React.CSSProperties
  /** Input type: text, email, number, password, tel, url, search, etc. */
  type?:
    | "text"
    | "email"
    | "number"
    | "password"
    | "tel"
    | "url"
    | "search"
    | "textarea"
    | "select"
    | "combobox"
    | "native-select"
    | "multiple-select"
    | "radio-group"
  /** Options for select, combobox, native-select, multiple-select, or radio-group type */
  selectOptions?: Array<{ value: string; label: string }>
  /** Search placeholder for combobox type */
  searchPlaceholder?: string
  /** Empty message for combobox type */
  emptyMessage?: string
  /** For multiple-select: selected options */
  selectedOptions?: MultipleSelectorOption[]
  /** For multiple-select: callback when selection changes */
  onSelectionChange?: (selected: MultipleSelectorOption[]) => void
  /** For radio-group: selected value */
  radioValue?: string
  /** For radio-group: callback when value changes */
  onRadioChange?: (value: string) => void
  /** Callback when floating state changes */
  onFloatingChange?: (isFloating: boolean) => void
  /** Whether to trim whitespace on blur (default: true, except for password and textarea) */
  trimOnBlur?: boolean
  /** For search type: callback when search value changes */
  onSearch?: (value: string) => void
  /** For search type: callback when clear button is clicked */
  onClear?: () => void
  /** For search type: whether to show the clear button */
  showClearButton?: boolean
  /** For search type: additional CSS classes for the search icon */
  iconClassName?: string
}

const FloatingLabelInput = React.forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  FloatingLabelInputProps
>(
  (
    {
      className,
      label,
      labelClassName,
      labelStyle,
      id,
      type = "text",
      selectOptions,
      searchPlaceholder,
      emptyMessage,
      value,
      defaultValue,
      onChange,
      onFloatingChange,
      selectedOptions,
      onSelectionChange,
      radioValue,
      onRadioChange,
      trimOnBlur,
      onSearch,
      onClear,
      showClearButton,
      iconClassName,
      disabled,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = React.useState(false)
    
    // Determine input types early (before hasValue initialization)
    const isPasswordType = type === "password"
    const isTextareaType = type === "textarea"
    const isSearchType = type === "search"
    const isSelectType = type === "select"
    const isComboboxType = type === "combobox"
    const isNativeSelectType = type === "native-select"
    const isMultipleSelectType = type === "multiple-select"
    const isRadioGroupType = type === "radio-group"
    
    // Initialize hasValue correctly based on initial value for select types
    // If disabled and value is empty, assume value is loading and keep label floating
    const initialSelectValue = (value as string) || (defaultValue as string) || ""
    const initialMultipleSelectValue = selectedOptions || []
    const initialRadioGroupValue = radioValue || (defaultValue as string) || ""
    const isValueLoading = disabled && initialSelectValue === ""
    
    const [hasValue, setHasValue] = React.useState(() => {
      // For select/combobox/native-select types, check if initial value is non-empty
      // If disabled and empty, assume value is loading (prevents label jump)
      if (isSelectType || isComboboxType || isNativeSelectType) {
        return initialSelectValue !== "" || isValueLoading
      }
      // For multiple-select, check if initial selection is non-empty
      if (isMultipleSelectType) {
        return initialMultipleSelectValue.length > 0 || isValueLoading
      }
      // For radio-group, check if initial value is non-empty
      if (isRadioGroupType) {
        return initialRadioGroupValue !== "" || isValueLoading
      }
      // For text inputs, default to false (will be set by useEffect or handlers)
      return false
    })

    // Determine if we should trim on blur
    // Default: true for most types, but false for password and textarea
    const shouldTrimOnBlur =
      trimOnBlur !== undefined ? trimOnBlur : type !== "password" && type !== "textarea"
    const [showPassword, setShowPassword] = React.useState(false)
    const [selectValue, setSelectValue] = React.useState<string>(initialSelectValue)
    const [multipleSelectValue, setMultipleSelectValue] = React.useState<MultipleSelectorOption[]>(
      initialMultipleSelectValue
    )
    const [radioGroupValue, setRadioGroupValue] = React.useState<string>(initialRadioGroupValue)
    const generatedId = React.useId()
    const finalInputId = id || generatedId
    const wrapperRef = React.useRef<HTMLDivElement>(null)
    const comboboxWrapperRef = React.useRef<HTMLDivElement>(null)
    const nativeSelectWrapperRef = React.useRef<HTMLDivElement>(null)
    const multipleSelectWrapperRef = React.useRef<HTMLDivElement>(null)
    const radioGroupWrapperRef = React.useRef<HTMLDivElement>(null)
    const inputRef = React.useRef<HTMLInputElement | null>(null)
    const cursorPositionRef = React.useRef<{ start: number; end: number } | null>(null)

    // Determine if this is a text input (not a select variant)
    const isTextInputType =
      !isSelectType &&
      !isComboboxType &&
      !isNativeSelectType &&
      !isMultipleSelectType &&
      !isRadioGroupType

    // Initialize hasValue for uncontrolled text inputs with defaultValue
    React.useEffect(() => {
      if (isTextInputType && value === undefined && defaultValue !== undefined) {
        setHasValue(String(defaultValue).length > 0)
      }
    }, []) // Only run on mount

    // Sync value prop with selectValue state for select types only
    // For regular text inputs, hasValue is managed by blur/change handlers
    React.useEffect(() => {
      if ((isSelectType || isComboboxType || isNativeSelectType) && value !== undefined) {
        const stringValue = String(value)
        setSelectValue(stringValue)
        // If disabled and empty, assume value is loading (prevents label jump)
        setHasValue(stringValue !== "" || (disabled && stringValue === ""))
      }
    }, [value, isSelectType, isComboboxType, isNativeSelectType, disabled])

    // Sync selectedOptions prop or value prop with multipleSelectValue state
    React.useEffect(() => {
      if (isMultipleSelectType) {
        if (selectedOptions !== undefined) {
          // selectedOptions is already MultipleSelectorOption[]
          setMultipleSelectValue(selectedOptions)
          // If disabled and empty, assume value is loading (prevents label jump)
          setHasValue(selectedOptions.length > 0 || (disabled && selectedOptions.length === 0))
        } else if (value !== undefined && Array.isArray(value)) {
          // value from React Hook Form is string[] - convert to MultipleSelectorOption[]
          const stringArray = value as string[]
          const convertedOptions: MultipleSelectorOption[] = stringArray
            .map((val) => {
              // Find matching option from selectOptions
              const option = selectOptions?.find((opt) => opt.value === val)
              return option ? { value: option.value, label: option.label } : null
            })
            .filter((opt): opt is MultipleSelectorOption => opt !== null)
          setMultipleSelectValue(convertedOptions)
          // If disabled and empty, assume value is loading (prevents label jump)
          setHasValue(convertedOptions.length > 0 || (disabled && convertedOptions.length === 0))
        }
      }
    }, [selectedOptions, value, isMultipleSelectType, selectOptions, disabled])

    // Sync radioValue prop with radioGroupValue state
    React.useEffect(() => {
      if (radioValue !== undefined) {
        setRadioGroupValue(radioValue)
        // If disabled and empty, assume value is loading (prevents label jump)
        setHasValue(radioValue !== "" || (disabled && radioValue === ""))
      }
    }, [radioValue, disabled])

    // Track focus for combobox by listening to focus events on the wrapper
    React.useEffect(() => {
      if (!isComboboxType || !comboboxWrapperRef.current) return

      const handleFocusIn = () => {
        setIsFocused(true)
      }

      const handleFocusOut = (e: FocusEvent) => {
        // Check if focus is moving to a child element
        const relatedTarget = e.relatedTarget as Node | null
        if (relatedTarget && comboboxWrapperRef.current?.contains(relatedTarget)) {
          return
        }
        setIsFocused(false)
        // If disabled and empty, assume value is loading (prevents label jump)
        setHasValue(selectValue !== "" || (disabled && selectValue === ""))
      }

      const wrapper = comboboxWrapperRef.current
      wrapper.addEventListener("focusin", handleFocusIn)
      wrapper.addEventListener("focusout", handleFocusOut)

      return () => {
        wrapper.removeEventListener("focusin", handleFocusIn)
        wrapper.removeEventListener("focusout", handleFocusOut)
      }
    }, [isComboboxType, selectValue, disabled])

    // Track focus for native-select by listening to focus events on the wrapper
    React.useEffect(() => {
      if (!isNativeSelectType || !nativeSelectWrapperRef.current) return

      const handleFocusIn = () => {
        setIsFocused(true)
      }

      const handleFocusOut = (e: FocusEvent) => {
        const relatedTarget = e.relatedTarget as Node | null
        if (relatedTarget && nativeSelectWrapperRef.current?.contains(relatedTarget)) {
          return
        }
        setIsFocused(false)
        // If disabled and empty, assume value is loading (prevents label jump)
        setHasValue(selectValue !== "" || (disabled && selectValue === ""))
      }

      const wrapper = nativeSelectWrapperRef.current
      wrapper.addEventListener("focusin", handleFocusIn)
      wrapper.addEventListener("focusout", handleFocusOut)

      return () => {
        wrapper.removeEventListener("focusin", handleFocusIn)
        wrapper.removeEventListener("focusout", handleFocusOut)
      }
    }, [isNativeSelectType, selectValue, disabled])

    // Track focus for multiple-select by listening to focus events on the wrapper
    React.useEffect(() => {
      if (!isMultipleSelectType || !multipleSelectWrapperRef.current) return

      const handleFocusIn = () => {
        setIsFocused(true)
      }

      const handleFocusOut = (e: FocusEvent) => {
        const relatedTarget = e.relatedTarget as Node | null
        if (relatedTarget && multipleSelectWrapperRef.current?.contains(relatedTarget)) {
          return
        }
        setIsFocused(false)
        // If disabled and empty, assume value is loading (prevents label jump)
        setHasValue(multipleSelectValue.length > 0 || (disabled && multipleSelectValue.length === 0))
      }

      const wrapper = multipleSelectWrapperRef.current
      wrapper.addEventListener("focusin", handleFocusIn)
      wrapper.addEventListener("focusout", handleFocusOut)

      return () => {
        wrapper.removeEventListener("focusin", handleFocusIn)
        wrapper.removeEventListener("focusout", handleFocusOut)
      }
    }, [isMultipleSelectType, multipleSelectValue, disabled])

    // Track focus for radio-group by listening to focus events on the wrapper
    React.useEffect(() => {
      if (!isRadioGroupType || !radioGroupWrapperRef.current) return

      const handleFocusIn = () => {
        setIsFocused(true)
      }

      const handleFocusOut = (e: FocusEvent) => {
        const relatedTarget = e.relatedTarget as Node | null
        if (relatedTarget && radioGroupWrapperRef.current?.contains(relatedTarget)) {
          return
        }
        setIsFocused(false)
        // If disabled and empty, assume value is loading (prevents label jump)
        setHasValue(radioGroupValue !== "" || (disabled && radioGroupValue === ""))
      }

      const wrapper = radioGroupWrapperRef.current
      wrapper.addEventListener("focusin", handleFocusIn)
      wrapper.addEventListener("focusout", handleFocusOut)

      return () => {
        wrapper.removeEventListener("focusin", handleFocusIn)
        wrapper.removeEventListener("focusout", handleFocusOut)
      }
    }, [isRadioGroupType, radioGroupValue, disabled])

    const inputType =
      isPasswordType && showPassword ? "text" : type === "password" ? "password" : type

    const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setIsFocused(true)
      if ("onFocus" in props && props.onFocus) {
        props.onFocus(e as React.FocusEvent<HTMLInputElement>)
      }
    }

    // Extract onBlur from props to compose with our handler
    const originalOnBlur = "onBlur" in props ? props.onBlur : undefined

    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setIsFocused(false)

      // Trim value on blur if enabled and it's a text input (not select, combobox, etc.)
      const isTextInputType =
        type !== "select" &&
        type !== "combobox" &&
        type !== "native-select" &&
        type !== "multiple-select" &&
        type !== "radio-group"

      if (shouldTrimOnBlur && isTextInputType && onChange) {
        const target = e.target as HTMLInputElement | HTMLTextAreaElement
        // Get the actual DOM value (browser may have auto-trimmed email inputs)
        const domValue = target?.value ?? ""

        if (type === "email") {
          // For email: browser auto-trims the DOM value on blur
          // Get the trimmed DOM value (browser has already trimmed it)
          const trimmedDomValue = typeof domValue === "string" ? domValue.trim() : domValue

          // Ensure DOM shows the trimmed value
          if (target) {
            target.value = trimmedDomValue
          }

          // Always update React Hook Form with the trimmed DOM value on blur
          // This ensures React Hook Form stays in sync with what the browser displays
          if (onChange) {
            const onChangeFn = onChange as unknown as
              | ((value: string) => void)
              | React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>

            if (typeof onChangeFn === "function") {
              ;(onChangeFn as (value: string) => void)(trimmedDomValue)
            }
          }
        } else {
          // For non-email inputs: trim the value normally
          const trimmedValue = typeof domValue === "string" ? domValue.trim() : domValue

          // Only update if value actually changed (had leading/trailing whitespace)
          if (trimmedValue !== domValue) {
            // Update the DOM input value directly first
            if (target) {
              target.value = trimmedValue
            }

            // React Hook Form's field.onChange accepts either an event or a value directly
            const onChangeFn = onChange as unknown as
              | ((value: string) => void)
              | React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>

            if (typeof onChangeFn === "function") {
              ;(onChangeFn as (value: string) => void)(trimmedValue)
            }
          }
        }
      }

      // Update hasValue for select types or uncontrolled text inputs
      if (
        isSelectType ||
        isComboboxType ||
        isNativeSelectType ||
        isMultipleSelectType ||
        isRadioGroupType
      ) {
        const value = "value" in e.target ? e.target.value : ""
        setHasValue(value !== "")
      } else if (value === undefined) {
        // For uncontrolled text inputs, track hasValue state from DOM
        const domValue = (e.target as HTMLInputElement | HTMLTextAreaElement)?.value ?? ""
        setHasValue(domValue !== "")
      }

      // Call the original onBlur handler (e.g., from React Hook Form)
      if (originalOnBlur) {
        originalOnBlur(e as React.FocusEvent<HTMLInputElement>)
      }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const newValue = e.target.value
      // Call onSearch for search type
      if (isSearchType && onSearch) {
        onSearch(newValue)
      }
      // Update hasValue for select types or uncontrolled text inputs
      if (
        isSelectType ||
        isComboboxType ||
        isNativeSelectType ||
        isMultipleSelectType ||
        isRadioGroupType
      ) {
        setHasValue(newValue !== "")
      } else if (value === undefined) {
        // For uncontrolled text inputs, track hasValue state
        setHasValue(newValue !== "")
      }
      if (onChange) {
        onChange(e as React.ChangeEvent<HTMLInputElement>)
      }
    }

    const handleClear = () => {
      // For uncontrolled inputs, clear the DOM value directly
      if (value === undefined && inputRef.current) {
        inputRef.current.value = ""
        setHasValue(false)
      }

      // Create a synthetic event with empty value
      const syntheticEvent = {
        target: { value: "" },
        currentTarget: { value: "" },
      } as React.ChangeEvent<HTMLInputElement>

      // Call onSearch with empty string
      if (isSearchType && onSearch) {
        onSearch("")
      }

      // Call onClear callback
      if (onClear) {
        onClear()
      }

      // Call onChange with empty value
      if (onChange) {
        onChange(syntheticEvent)
      }
    }

    const handleSelectChange = (newValue: string) => {
      setSelectValue(newValue)
      setHasValue(newValue !== "")
      // Create a synthetic event for onChange compatibility
      if (onChange) {
        const syntheticEvent = {
          target: { value: newValue },
          currentTarget: { value: newValue },
        } as React.ChangeEvent<HTMLInputElement>
        onChange(syntheticEvent)
      }
    }

    const handleNativeSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newValue = e.target.value
      setSelectValue(newValue)
      setHasValue(newValue !== "")
      if (onChange) {
        onChange(e as unknown as React.ChangeEvent<HTMLInputElement>)
      }
    }

    const handleMultipleSelectChange = (selected: MultipleSelectorOption[]) => {
      setMultipleSelectValue(selected)
      setHasValue(selected.length > 0)
      if (onSelectionChange) {
        onSelectionChange(selected)
      }
      // Call onChange for React Hook Form integration
      // React Hook Form expects string[] for array fields, so convert objects to strings
      if (onChange) {
        // Convert MultipleSelectorOption[] to string[] for React Hook Form
        const stringArray: string[] = selected.map((opt) => opt.value)
        // Create a synthetic event with the string array
        const syntheticEvent = {
          target: { value: stringArray },
          currentTarget: { value: stringArray },
        } as unknown as React.ChangeEvent<HTMLInputElement>
        onChange(syntheticEvent)
      }
    }

    const handleRadioGroupChange = (newValue: string) => {
      setRadioGroupValue(newValue)
      setHasValue(newValue !== "")
      if (onRadioChange) {
        onRadioChange(newValue)
      }
      // Also call onChange for compatibility
      if (onChange) {
        const syntheticEvent = {
          target: { value: newValue },
          currentTarget: { value: newValue },
        } as React.ChangeEvent<HTMLInputElement>
        onChange(syntheticEvent)
      }
    }

    // Combined ref callback for input element
    // Used for password type (cursor position) and search type (clearing uncontrolled inputs)
    const setInputRef = React.useCallback(
      (node: HTMLInputElement | null) => {
        inputRef.current = node
        if (typeof ref === "function") {
          ref(node)
        } else if (ref) {
          ;(ref as React.MutableRefObject<HTMLInputElement | null>).current = node
        }
      },
      [ref]
    )

    const togglePasswordVisibility = () => {
      // Save cursor position before toggling
      const input = inputRef.current
      if (input) {
        const start = input.selectionStart ?? 0
        const end = input.selectionEnd ?? 0
        cursorPositionRef.current = { start, end }
      }
      setShowPassword((prev) => !prev)
    }

    // Restore cursor position after password visibility toggle
    React.useEffect(() => {
      if (isPasswordType && cursorPositionRef.current && inputRef.current) {
        const { start, end } = cursorPositionRef.current
        // Use requestAnimationFrame to ensure DOM has updated
        requestAnimationFrame(() => {
          if (inputRef.current) {
            inputRef.current.setSelectionRange(start, end)
            cursorPositionRef.current = null // Clear after restoring
          }
        })
      }
    }, [showPassword, isPasswordType])

    // For text inputs, check value prop directly - empty string means no value
    // For uncontrolled inputs (value === undefined), use hasValue state
    const textInputHasValue = isTextInputType
      ? value !== undefined
        ? value != null && String(value).length > 0
        : hasValue
      : false

    const selectVal = isSelectType || isComboboxType || isNativeSelectType ? selectValue : undefined
    const multipleSelectVal = isMultipleSelectType ? multipleSelectValue : undefined
    const radioGroupVal = isRadioGroupType ? radioGroupValue : undefined

    const selectHasValue = !isTextInputType
      ? hasValue ||
        (selectVal !== undefined && selectVal !== "") ||
        (multipleSelectVal !== undefined && multipleSelectVal.length > 0) ||
        (radioGroupVal !== undefined && radioGroupVal !== "")
      : false

    const hasValueState = isTextInputType ? textInputHasValue : selectHasValue

    // For radio-group, label should always be floating
    const isFloating: boolean = isRadioGroupType ? true : Boolean(isFocused || hasValueState)

    // Notify parent component when floating state changes
    React.useEffect(() => {
      onFloatingChange?.(isFloating)
    }, [isFloating, onFloatingChange])

    const baseInputClasses = cn(
      "flex w-full rounded-app-radius border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-[background-color,border-color] duration-150 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-input-placeholder disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
      "text-foreground"
    )

    const inputClasses = cn(
      baseInputClasses,
      "bg-transparent peer h-11 placeholder:text-transparent",
      isSearchType && "pl-9",
      isSearchType && showClearButton !== false && textInputHasValue && "pr-9",
      isPasswordType && "pr-12",
      className
    )

    const textareaClasses = cn(
      baseInputClasses,
      "bg-transparent peer min-h-[120px] w-full resize-none pt-4 pb-2 placeholder:text-transparent h-11",
      className
    )

    const labelClasses = cn(
      "rounded-app-radius floating-label-input-label absolute pointer-events-none z-10",
      // Fixed height to prevent vertical size changes (slightly reduced)
      "h-4 flex items-center",
      // Transition all properties with custom duration
      "transition-[top,transform,font-size,color,opacity,background-color,left]",
      "duration-200",
      // Apply background color - when focused use bg-foreground, otherwise use existing logic
      isFocused ? "bg-foreground" : isFloating ? "bg-border" : "bg-border/[0]",
      // Always apply consistent horizontal padding
      "px-2",
      // Text colors - when focused use text-background, otherwise use existing logic
      isFocused ? "text-background" : isFloating ? "text-foreground" : "text-input-placeholder",
      // Default state: reduced text opacity when not floating
      !isFloating && "opacity-80",
      // Position and size
      isFloating
        ? "left-3 top-0 -translate-y-1/2 text-xs font-medium"
        : isTextareaType
          ? "left-3 top-4 text-base"
          : isSearchType
            ? "left-[36px] top-1/2 -translate-y-1/2 text-base"
            : "left-3 top-1/2 -translate-y-1/2 text-base",
      labelClassName // labelClassName should override default colors (e.g., for error states)
    )

    return (
      <div ref={wrapperRef} className="relative w-full">
        {isTextareaType ? (
          <textarea
            ref={ref as React.Ref<HTMLTextAreaElement>}
            id={finalInputId}
            suppressHydrationWarning
            className={textareaClasses}
            placeholder=" "
            onFocus={handleFocus}
            onChange={handleChange}
            value={value}
            defaultValue={defaultValue}
            disabled={disabled}
            {...(props as Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "onBlur">)}
            onBlur={handleBlur}
          />
        ) : isSelectType ? (
          <div className="relative">
            {/* Hidden input for form submission */}
            <input
              type="hidden"
              name={props.name}
              value={selectValue}
              id={`${finalInputId}-hidden`}
              suppressHydrationWarning
            />
            <Select
              value={selectValue}
              onValueChange={handleSelectChange}
              onOpenChange={(open) => {
                if (open) {
                  setIsFocused(true)
                } else {
                  setIsFocused(false)
                  // If disabled and empty, assume value is loading (prevents label jump)
                  setHasValue(selectValue !== "" || (disabled && selectValue === ""))
                }
              }}
            >
              <SelectTrigger
                id={finalInputId}
                suppressHydrationWarning
                disabled={disabled}
                className={cn(
                  "peer h-11 w-full border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-transparent data-[placeholder]:text-input-placeholder md:text-sm",
                  "text-foreground ring-offset-background",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  "data-[state=open]:ring-2 data-[state=open]:ring-ring data-[state=open]:ring-offset-2",
                  className
                )}
                onFocus={(e) => {
                  setIsFocused(true)
                  if ("onFocus" in props && props.onFocus) {
                    props.onFocus(e as React.FocusEvent<HTMLInputElement>)
                  }
                }}
                onBlur={(e) => {
                  setIsFocused(false)
                  // If disabled and empty, assume value is loading (prevents label jump)
                  setHasValue(selectValue !== "" || (disabled && selectValue === ""))
                  if (originalOnBlur) {
                    originalOnBlur(e as React.FocusEvent<HTMLInputElement>)
                  }
                  if ("onBlur" in props && props.onBlur) {
                    props.onBlur(e as React.FocusEvent<HTMLInputElement>)
                  }
                }}
              >
                <SelectValue placeholder=" " />
              </SelectTrigger>
              <SelectContent>
                {selectOptions?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : isComboboxType ? (
          <div ref={comboboxWrapperRef} className="relative">
            {/* Hidden input for form submission */}
            <input
              type="hidden"
              name={props.name}
              value={selectValue}
              id={`${finalInputId}-hidden`}
              suppressHydrationWarning
            />
            <Combobox
              id={finalInputId}
              options={selectOptions || []}
              value={selectValue}
              onValueChange={(newValue) => {
                handleSelectChange(newValue)
                // If disabled and empty, assume value is loading (prevents label jump)
                setHasValue(newValue !== "" || (disabled && newValue === ""))
              }}
              onBlur={() => {
                // Call original onBlur handler for React Hook Form validation
                if (originalOnBlur) {
                  const syntheticEvent = {
                    target: { value: selectValue },
                    currentTarget: { value: selectValue },
                  } as React.FocusEvent<HTMLInputElement>
                  originalOnBlur(syntheticEvent)
                }
              }}
              placeholder={props.placeholder || " "}
              searchPlaceholder={searchPlaceholder}
              emptyMessage={emptyMessage}
              className={cn("peer h-11 w-full text-base md:text-sm", className)}
            />
          </div>
        ) : isNativeSelectType ? (
          <div ref={nativeSelectWrapperRef} className="relative">
            <NativeSelect
              id={finalInputId}
              suppressHydrationWarning
              value={selectValue}
              defaultValue={defaultValue}
              disabled={disabled}
              onChange={handleNativeSelectChange}
              onFocus={(e) => {
                setIsFocused(true)
                if ("onFocus" in props && props.onFocus) {
                  props.onFocus(e as unknown as React.FocusEvent<HTMLInputElement>)
                }
              }}
              onBlur={(e) => {
                setIsFocused(false)
                if (originalOnBlur) {
                  originalOnBlur(e as unknown as React.FocusEvent<HTMLInputElement>)
                }
                // If disabled and empty, assume value is loading (prevents label jump)
                setHasValue(selectValue !== "" || (disabled && selectValue === ""))
                if ("onBlur" in props && props.onBlur) {
                  props.onBlur(e as unknown as React.FocusEvent<HTMLInputElement>)
                }
              }}
              className={cn("peer h-11 w-full text-base md:text-sm", className)}
              {...(props as React.SelectHTMLAttributes<HTMLSelectElement>)}
            >
              <option value="">{props.placeholder || " "}</option>
              {selectOptions?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </NativeSelect>
          </div>
        ) : isMultipleSelectType ? (
          <div ref={multipleSelectWrapperRef} className="relative">
            <MultipleSelector
              options={selectOptions?.map((opt) => ({ value: opt.value, label: opt.label })) || []}
              selected={multipleSelectValue}
              onChange={handleMultipleSelectChange}
              disabled={disabled}
              onBlur={() => {
                // Call original onBlur handler for React Hook Form validation
                if (originalOnBlur) {
                  const syntheticEvent = {
                    target: { value: multipleSelectValue.map((opt) => opt.value) },
                    currentTarget: { value: multipleSelectValue.map((opt) => opt.value) },
                  } as unknown as React.FocusEvent<HTMLInputElement>
                  originalOnBlur(syntheticEvent)
                }
              }}
              placeholder=""
              triggerClassName={cn("peer min-h-[44px] py-2 w-full text-base md:text-sm", className)}
            />
          </div>
        ) : isRadioGroupType ? (
            <div
            ref={radioGroupWrapperRef}
            className={cn(
              "relative rounded-app-radius border border-input bg-transparent px-3 py-4 pt-5 min-h-[44px] w-full",
              isFocused && "ring-2 ring-ring ring-offset-2",
              className
            )}
          >
            <RadioGroup
              value={radioGroupValue}
              onValueChange={handleRadioGroupChange}
              disabled={disabled}
              className="space-y-2"
            >
              {selectOptions?.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`${finalInputId}-${option.value}`} />
                  <Label htmlFor={`${finalInputId}-${option.value}`} className="cursor-pointer">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        ) : isPasswordType ? (
          <>
            <input
              autoComplete="off"
              ref={setInputRef}
              id={finalInputId}
              suppressHydrationWarning
              type={inputType}
              className={inputClasses}
              placeholder=" "
              onFocus={handleFocus}
              onChange={handleChange}
              value={value}
              defaultValue={defaultValue}
              disabled={disabled}
              {...(props as Omit<React.InputHTMLAttributes<HTMLInputElement>, "onBlur">)}
              onBlur={handleBlur}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              onMouseDown={(e) => {
                e.preventDefault()
              }}
              className={cn(
                "absolute right-4 top-1/2 -translate-y-1/2 transition-[color,opacity] duration-300 z-10",
                "text-foreground"
              )}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
            </button>
          </>
        ) : (
          <>
            {isSearchType && (
              <Search
                className={cn(
                  "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10",
                  iconClassName
                )}
              />
            )}
            <Input
              autoComplete="off"
              ref={
                isSearchType && value === undefined
                  ? setInputRef
                  : (ref as React.Ref<HTMLInputElement>)
              }
              id={finalInputId}
              suppressHydrationWarning
              type={inputType}
              className={inputClasses}
              placeholder=" "
              onFocus={handleFocus}
              onChange={handleChange}
              value={value}
              defaultValue={defaultValue}
              disabled={disabled}
              {...(props as Omit<React.InputHTMLAttributes<HTMLInputElement>, "onBlur">)}
              onBlur={handleBlur}
            />
            {isSearchType && showClearButton !== false && textInputHasValue && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 z-10"
                onClick={handleClear}
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </>
        )}
        <label
          htmlFor={finalInputId}
          suppressHydrationWarning
          className={labelClasses}
          style={
            {
              ...labelStyle,
              // Use cubic-bezier timing function for smooth transitions
              transitionTimingFunction: "cubic-bezier(0.65, -0.32, 0.38, 1.23)",
            } as React.CSSProperties
          }
        >
          {label}
        </label>
      </div>
    )
  }
)

FloatingLabelInput.displayName = "FloatingLabelInput"

export { FloatingLabelInput }
