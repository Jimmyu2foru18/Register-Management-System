<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class BatchProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('manage-inventory');
    }

    public function rules(): array
    {
        return [
            'products' => 'required|array',
            'products.*.name' => 'required|string|max:255',
            'products.*.category' => 'required|string|max:100',
            'products.*.price' => 'required|numeric|min:0',
            'products.*.stock_quantity' => 'required|integer|min:0',
            'products.*.min_stock_level' => 'required|integer|min:0',
            'products.*.reorder_quantity' => 'required|integer|min:0',
            'products.*.barcode' => 'required|string|unique:products,barcode',
        ];
    }

    public function messages(): array
    {
        return [
            'products.*.name.required' => 'Product name is required',
            'products.*.category.required' => 'Product category is required',
            'products.*.price.required' => 'Product price is required',
            'products.*.price.min' => 'Product price must be greater than 0',
            'products.*.stock_quantity.required' => 'Stock quantity is required',
            'products.*.stock_quantity.min' => 'Stock quantity must be greater than 0',
            'products.*.barcode.unique' => 'Barcode must be unique',
        ];
    }
} 