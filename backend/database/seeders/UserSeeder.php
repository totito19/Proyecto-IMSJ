<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        if (! app()->isLocal()) {
            return;
        }

        User::query()->updateOrCreate(
            ['cedula' => '11111111'],
            ['nombre' => null, 'password' => 'imsj1234', 'rol' => 'PUBLICO_GENERAL', 'activo' => true],
        );

        User::query()->updateOrCreate(
            ['cedula' => '22222222'],
            ['nombre' => 'María Vázquez', 'password' => 'imsj1234', 'rol' => 'PERSONAL_IMSJ', 'activo' => true],
        );
    }
}
