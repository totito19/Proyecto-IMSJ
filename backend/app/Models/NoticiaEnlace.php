<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['noticia_id', 'url'])]
class NoticiaEnlace extends Model
{
    protected $table = 'noticia_enlaces';

    public function noticia(): BelongsTo
    {
        return $this->belongsTo(Noticia::class);
    }
}
