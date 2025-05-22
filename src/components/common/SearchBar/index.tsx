import { Box, InputBase } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
// @project
import styles from './styles.module.scss';

interface SearchBarProps {
    placeholder?: string;
    onSearch?: (value: string) => void;
}

const SearchBar = ({ placeholder = 'Tìm kiếm...', onSearch }: SearchBarProps) => {
    return (
        <Box className={styles.searchWrapper}>
            <Box className={styles.searchBox}>
                <Box className={styles.searchIconWrapper}>
                    <SearchIcon />
                </Box>
                <InputBase
                    className={styles.searchInput}
                    placeholder={placeholder}
                    onChange={(e) => onSearch?.(e.target.value)}
                />
            </Box>
        </Box>
    );
};

export default SearchBar;