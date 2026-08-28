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
            ['password' => 'imsj1234', 'rol' => 'PUBLICO_GENERAL'],
        );

        User::query()->updateOrCreate(
            ['cedula' => '22222222'],
            ['password' => 'imsj1234', 'rol' => 'PERSONAL_IMSJ'],
        );
    }
}
