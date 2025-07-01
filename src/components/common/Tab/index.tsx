import { Button, ButtonGroup } from '@mui/material';
// @project
import styles from './styles.module.scss';

const LIBRARY_TABS = [
    { label: 'Tất cả', value: 0 },
    { label: 'Bản nháp', value: 1 },
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