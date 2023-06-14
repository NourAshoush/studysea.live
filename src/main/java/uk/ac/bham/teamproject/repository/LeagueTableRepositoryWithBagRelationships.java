package uk.ac.bham.teamproject.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import uk.ac.bham.teamproject.domain.LeagueTable;

public interface LeagueTableRepositoryWithBagRelationships {
    Optional<LeagueTable> fetchBagRelationships(Optional<LeagueTable> leagueTable);

    List<LeagueTable> fetchBagRelationships(List<LeagueTable> leagueTables);

    Page<LeagueTable> fetchBagRelationships(Page<LeagueTable> leagueTables);
}
