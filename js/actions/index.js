export type Action =

  // APP
  {
    type: 'app/initialize',
  } |

  // EXPENSES
  {
    type: 'expense/update',
    id: string,
    text: string,
  } |
  {
    type: 'expense/create'
  };
