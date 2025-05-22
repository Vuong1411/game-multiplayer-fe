import { Button, ButtonGroup } from '@mui/material';
// @project
import styles from './styles.module.scss';

const LIBRARY_TABS = [
    { label: 'Tất cả', value: 0 },
    { label: 'Của tôi', value: 1 },
    { label: 'Bản nháp', value: 2 },
    { label: 'Yêu thích', value: 3 }
]

interface TabFilterProps {
    activeTab: number;
    onTabChange: (value: number) => void;
}

const TabFilter = ({ activeTab, onTabChange }: TabFilterProps) => {
    return (
        <ButtonGroup variant="outlined" className={styles.tabs}>
            {LIBRARY_TABS.map(tab => (
                <Button
                    key={tab.value}
                    onClick={() => onTabChange(tab.value)}
                    variant={activeTab === tab.value ? 'contained' : 'outlined'}
                    className={styles.tab}
                >
                    {tab.label}
                </Button>
            ))}
        </ButtonGroup>
    );
};

export default TabFilter;