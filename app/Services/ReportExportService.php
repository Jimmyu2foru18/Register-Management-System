<?php

namespace App\Services;

use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Storage;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

class ReportExportService
{
    public function exportToExcel(array $data, string $filename): string
    {
        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();

        // Add headers
        $headers = array_keys(reset($data));
        foreach ($headers as $index => $header) {
            $sheet->setCellValueByColumnAndRow($index + 1, 1, ucwords(str_replace('_', ' ', $header)));
        }

        // Add data
        foreach ($data as $rowIndex => $row) {
            foreach ($row as $columnIndex => $value) {
                $sheet->setCellValueByColumnAndRow(
                    array_search($columnIndex, array_keys($row)) + 1,
                    $rowIndex + 2,
                    $value
                );
            }
        }

        $writer = new Xlsx($spreadsheet);
        $path = "reports/{$filename}.xlsx";
        Storage::put($path, '');
        $writer->save(Storage::path($path));

        return $path;
    }

    public function exportToCsv(array $data, string $filename): string
    {
        $path = "reports/{$filename}.csv";
        $handle = fopen(Storage::path($path), 'w');

        // Add headers
        fputcsv($handle, array_keys(reset($data)));

        // Add data
        foreach ($data as $row) {
            fputcsv($handle, $row);
        }

        fclose($handle);
        return $path;
    }
} 