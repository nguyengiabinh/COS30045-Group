import csv
import re

# Specify the input CSV file path
input_file = 'event_data_pse.csv'
# Specify the output CSV file path
output_file = 'maindata4.csv'

# Open the input and output CSV files
with open(input_file, 'r') as csv_in, open(output_file, 'w', newline='') as csv_out:
    reader = csv.reader(csv_in)
    writer = csv.writer(csv_out)

    # Get the header row
    header = next(reader)

    # Find the index of the column with the letter 'O' (case-insensitive)
    column_index = next((i for i, col in enumerate(header) if 'o' in col.lower()), None)

    # If the column is not found, raise an exception
    if column_index is None:
        raise ValueError("Column with letter 'O' not found in the CSV file.")

    # Write the header row to the output file
    writer.writerow(header)

    # Iterate over the remaining rows in the input CSV file
    for row in reader:
        # Remove all whitespace characters (including U+00A0) from the specified column
        row[column_index] = re.sub(r'[\s\ufffd]+', '', row[column_index])
        writer.writerow(row)

print(f"Cleaned CSV file written to '{output_file}'")