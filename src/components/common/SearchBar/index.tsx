import { Box, InputBase, IconButton, InputAdornment } from '@mui/material';
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';
import { useState } from 'react';
// @project
import styles from './styles.module.scss';

interface SearchBarProps {
    placeholder?: string;
    onSearch?: (value: string) => void;
}

const SearchBar = ({ placeholder = 'Tìm kiếm...', onSearch }: SearchBarProps) => {
    const [value, setValue] = useState('');
    const handleSearch = () => {
        if (onSearch) onSearch(value.trim());
    };
    const handleClear = () => {
        setValue('');
        if (onSearch) onSearch('');
    };
    return (
        <Box className={styles.searchWrapper}>
            <Box className={styles.searchBox}>
                <Box className={styles.searchIconWrapper}>
                    <SearchIcon />
                </Box>
                <InputBase
                    className={styles.searchInput}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={e => {
                        if (e.key === 'Enter') handleSearch();
                    }}
                    endAdornment={
                        value ? (
                            <InputAdornment position="end">
                                <IconButton
                                    size="small"
                                    onClick={handleClear}
                                    edge="end"
                                >
                                    <ClearIcon />
                                </IconButton>
                            </InputAdornment>
                        ) : null
                    }
                />
            </Box>
        </Box>
    );
};

export default SearchBar;