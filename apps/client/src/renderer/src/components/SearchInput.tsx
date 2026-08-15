import React, { useState, useEffect } from 'react'
import { Search } from 'lucide-react'

interface SearchInputProps {
  value: string
  onChange: (val: string) => void
  placeholder?: string
  delay?: number
}

export const SearchInput: React.FC<SearchInputProps> = ({ value, onChange, placeholder = 'Search...', delay = 300 }) => {
  const [localVal, setLocalVal] = useState(value)

  useEffect(() => {
    setLocalVal(value)
  }, [value])

  useEffect(() => {
    const handler = setTimeout(() => {
      onChange(localVal)
    }, delay)
    return () => clearTimeout(handler)
  }, [localVal, delay, onChange])

  return (
    <div className="search-input-container">
      <Search className="search-icon" size={18} />
      <input
        type="text"
        className="form-input search-input"
        placeholder={placeholder}
        value={localVal}
        onChange={(e) => setLocalVal(e.target.value)}
      />
    </div>
  )
}
