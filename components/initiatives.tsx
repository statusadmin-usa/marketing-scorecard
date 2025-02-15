import { TableCell, Select } from '@mui/material';
import cn from 'classnames';

//Added function to format currency.  Assumes a simple $ prefix for demonstration.  More robust solution might use Intl.NumberFormat.
const formatCurrency = (amount) => `$${amount}`;

//Added function to determine difficulty level for visual representation.  Assumes a simple mapping for demonstration.  A more complex mapping might be needed depending on the data structure of `initiative.difficulty`.
const getDifficultyLevel = (difficulty) => {
  switch (difficulty) {
    case 'low': return 1;
    case 'medium': return 2;
    case 'high': return 3;
    default: return 0; //Handle unexpected values
  }
};


const InitiativesTable = ({ initiatives }) => (
  <table>
    <thead>
      <tr>
        <th>Initiative Name</th>
        <th>Cost</th>
        <th>Difficulty</th>
      </tr>
    </thead>
    <tbody>
      {initiatives.map((initiative) => (
        <tr key={initiative.id}>
          <TableCell className="w-[300px]">{initiative.name}</TableCell>
          <TableCell className="w-[80px]">${formatCurrency(initiative.cost)}</TableCell>
          <TableCell className="w-[80px]">
            <div className="flex gap-1">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={cn(
                    "w-3 h-3 rounded-sm",
                    i <= getDifficultyLevel(initiative.difficulty)
                      ? "bg-primary"
                      : "bg-gray-200 border border-gray-300"
                  )}
                />
              ))}
            </div>
          </TableCell>
        </tr>
      ))}
    </tbody>
  </table>
);

export default InitiativesTable;