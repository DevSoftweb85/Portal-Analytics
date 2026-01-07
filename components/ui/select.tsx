"use client"

import * as React from "react"

const Select = React.forwardRef<
    HTMLSelectElement,
    React.SelectHTMLAttributes<HTMLSelectElement> & {
        onValueChange?: (value: string) => void
    }
>(({ className, children, onValueChange, ...props }, ref) => {
    return (
        <select
            className={`flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
            ref={ref}
            onChange={(e) => {
                props.onChange?.(e)
                onValueChange?.(e.target.value)
            }}
            {...props}
        >
            {children}
        </select>
    )
})
Select.displayName = "Select"

const SelectTrigger = Select
const SelectContent = ({ children }: { children: React.ReactNode }) => <>{children}</>
const SelectValue = ({ placeholder }: { placeholder?: string }) => <option value="">{placeholder}</option>

const SelectItem = React.forwardRef<
    HTMLOptionElement,
    React.OptionHTMLAttributes<HTMLOptionElement>
>(({ className, children, ...props }, ref) => {
    return (
        <option ref={ref} {...props}>
            {children}
        </option>
    )
})
SelectItem.displayName = "SelectItem"

export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue }
