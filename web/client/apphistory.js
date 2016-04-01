import { useRouterHistory } from 'react-router';
import { createHistory } from 'history'

const appHistory = useRouterHistory(createHistory)({
    queryKey: false
});

export default appHistory;
